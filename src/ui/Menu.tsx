import * as React from "react";
import { MenuItemLink, MenuProps, ResourceProps, DashboardMenuItem, Menu, useResourceDefinitions } from "react-admin";
import Divider from "@mui/material/Divider";
import FolderIcon from "@mui/icons-material/Folder";
import DefaultIcon from "@mui/icons-material/ViewList";
import SettingsIcon from '@mui/icons-material/Settings';

import SubMenu from "./SubMenu";
import { validators } from "../validateItems";

const MyMenu: React.FC<MenuProps> = (props) => {
	const resourcesDefinitions = useResourceDefinitions();
	const resources = Object.keys(resourcesDefinitions).map(name => resourcesDefinitions[name]);

	const resourcesByValidator: Record<string, ResourceProps[]> = {};
	for (const resource of resources) {
		const validatorName = resource.name.split("/")[0];
		if (!resourcesByValidator[validatorName]) {
			resourcesByValidator[validatorName] = [];
		}
		resourcesByValidator[validatorName].push(resource);
	}

	const [submenuOpenState, setSubmenuOpenState] = React.useState<Record<string, boolean>>({});
	const handleSubmenuToggle = React.useMemo(() => {
		const handlers: Record<string, () => void> = {};
		for (const validator of validators) {
			handlers[validator.name] = () => setSubmenuOpenState((openState) => ({
				...openState,
				[validator.name]: !openState[validator.name],
			}));
		}
		return handlers;
	}, []);

	return (
		<Menu {...props}>
			<DashboardMenuItem dense={props.dense} />
			<Divider />
			{validators.filter((validator) => !!resourcesByValidator[validator.name]).map((validator) => (
				<SubMenu
					key={validator.name}
					open={!!submenuOpenState[validator.name]}
					handleToggle={handleSubmenuToggle[validator.name]}
					icon={<FolderIcon />}
					title={validator.title}
					dense={props.dense}
				>
					{resourcesByValidator[validator.name].map((resource) => (
						<MenuItemLink
							key={resource.name}
							to={`/${resource.name}`}
							primaryText={
								((resource.options as { label?: string; })?.label) ||
								resource.name}
							leftIcon={resource.icon ? <resource.icon /> : <DefaultIcon />}
							dense={props.dense}
						/>
					))}
				</SubMenu>
			))}
			<Divider />
			<MenuItemLink
				to="/config"
				primaryText="設定"
				leftIcon={<SettingsIcon />}
				dense={props.dense}
			/>
		</Menu>
	);
};

export default MyMenu;
