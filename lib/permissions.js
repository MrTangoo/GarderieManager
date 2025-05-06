export const permissions = {
    ADMIN: {
        canView: true,
        canCreate: true,
        canEdit: true,
        canArchive: true,
        canDelete: true,
        canEditPresence: true,
    },
    RESPONSABLE: {
        canView: true,
        canCreate: true,
        canEdit: true,
        canArchive: true,
        canDelete: true,
        canEditPresence: false,
    },
    EDUCATEUR: {
        canView: true,
        canCreate: true,
        canEdit: true,
        canArchive: true,
        canDelete: false,
        canEditPresence: false,
    },
    PARENT: {
        canView: true,
        canCreate: false,
        canEdit: false,
        canArchive: false,
        canDelete: false,
        canEditPresence: true,
    },
}

export function can(user, action) {
    const role = user?.role
    return permissions[role]?.[action] === true
}
