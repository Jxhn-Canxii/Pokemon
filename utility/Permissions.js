import { decryptData } from './AES';
import { ROLE,PERMISSION } from './Global';

export const hasPermission = (permission) => {
    return checkRoleForPermission(permission);
};

const checkRoleForPermission = (permission) => {
    const permissionMap = PERMISSION();

    if(permissionMap){
         // Find the object with the matching permission key
        const foundPermission = permissionMap.find(item => item.permission === permission);
        // Check if the permission is found
        if (!foundPermission) {
            console.log(`Permission "${permission}" not found.`);
            return false; // or handle it accordingly based on your requirements
        }
       
        // Return the value of hasPermission if the permission is found
        return foundPermission.hasPermission;
    }
    return false;
}
