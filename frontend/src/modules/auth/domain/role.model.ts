export type RolePermission =
	| 'admin_access'
	| 'manager_access'
	| 'user_access'
	| string

export interface Role {
	id: number
	name: string
	description: string
	permissions: RolePermission[]
}

export interface CreateRolePayload {
	name: string
	description?: string
	permissions: RolePermission[]
}

export type UpdateRolePayload = Partial<CreateRolePayload>

export interface AssignRolePayload {
	user_id: number
	role_id: number
}
