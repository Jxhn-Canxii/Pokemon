<template>
  <div>
    <!-- Edit Button -->
    <UButton icon="i-heroicons-pencil" color="yellow" @click="openEditModal">
      Edit
    </UButton>

    <!-- Edit Role Modal -->
    <Modalx :show="isEditPermissionOpen" title="Edit Permissions" @close="isEditPermissionOpen = false" :maxWidth="'2xl'">
      <UCard>
        <UForm @submit.prevent="editRole" class="space-y-4">
          <h3 class="text-lg font-semibold">Edit Role</h3>
          <hr>

          <!-- Role Name (Read-Only) -->
          <UFormGroup label="Role Name">
            <UInput v-model="roleForm.role_name" disabled class="bg-gray-200" />
          </UFormGroup>

          <!-- User Permissions -->
          <h3 class="text-md font-semibold">User Permissions</h3>

          <!-- Select All Permissions -->
          <UCheckbox 
            :checked="allPermissionsSelected"
            @change="toggleSelectAllPermissions"
          >
            Select All
          </UCheckbox>

          <div class="divide-y divide-gray-200 border-t border-dashed mt-2">
            <div v-for="(permissionGroup, groupName) in permissions" :key="groupName" class="py-2">
              <!-- Group Header -->
              <div class="flex items-center mb-4">
                <UCheckbox
                  :checked="isGroupSelected(groupName)"
                  @change="toggleSelectGroup(groupName)"
                />
                <span class="ml-2 text-sm font-semibold uppercase">{{ groupName }}</span>
              </div>

              <!-- Individual Permissions -->
              <div class="ml-4 grid grid-cols-2 gap-2">
                <UCheckbox 
                  v-for="permission in permissionGroup" 
                  :key="permission.id" 
                  v-model="roleForm.permission_ids" 
                  :value="permission.id"
                  :label="replaceUnderScore(permission.name)"
                >
                </UCheckbox>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <p v-if="errors.permission_ids" class="text-red-500 text-sm mt-1">
            {{ errors.permission_ids[0] }}
          </p>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <UButton type="submit" color="blue">Submit</UButton>
          </div>
        </UForm>
      </UCard>
    </Modalx>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { VUE_APP_API_URL } from "@/utility/Global";
import { FormDx, BearToken, Alerto, handleApiError, replaceUnderScore } from "@/utility/Helper";

const isEditPermissionOpen = ref(false);

// Form data
const roleForm = ref({
  role_id: 0,
  role_name: "",
  permission_ids: [],
});

const errors = ref({}); // To store validation errors

// Permission management
const permissions = ref({});
const allPermissionsSelected = ref(false);
const selectedGroups = ref({});

// Props and emits
const emits = defineEmits(["transaction_id"]);
const props = defineProps({ data: Object });

// Open Edit Modal and Load Data
const openEditModal = () => {
  isEditPermissionOpen.value = true;
  loadRolePermissions();
};

// Fetch Permissions for the Role
const loadRolePermissions = async () => {
  try {
    const formData = FormDx({ role_id: props.data.id });
    const response = await axios.post(`${VUE_APP_API_URL}roles/get-permissions-by-role`, formData, BearToken());

    if (response.data && response.data.permissions) {
      const groupedPermissions = {};
      roleForm.value.permission_ids = [];

      response.data.permissions.forEach(permission => {
        if (!groupedPermissions[permission.type]) {
          groupedPermissions[permission.type] = [];
        }
        if (permission.isPermission) {
          roleForm.value.permission_ids.push(permission.id);
        }
        groupedPermissions[permission.type].push(permission);
      });

      permissions.value = groupedPermissions;
      roleForm.value.role_id = props.data.id;
      roleForm.value.role_name = props.data.name;
    }
  } catch (error) {
    handleApiError(error);
  }
};

// Submit Updated Role Permissions
const editRole = async () => {
  try {
    errors.value = {}; // Reset errors
    const formData = FormDx(roleForm.value);
    const response = await axios.post(`${VUE_APP_API_URL}roles/add-permissions-role`, formData, BearToken());

    isEditPermissionOpen.value = false;
    Alerto("success", "Success", response.data.message);
    emits("transaction_id", Math.random());
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      // Handle Laravel validation errors
      errors.value = error.response.data.errors;
    } else {
      Alerto("error", "Error", error.response?.data?.message || "An error occurred.");
    }
  }
};

// Select/Deselect All Permissions
const toggleSelectAllPermissions = (event) => {
  allPermissionsSelected.value = event;
  roleForm.value.permission_ids = event
    ? Object.values(permissions.value).flat().map(permission => permission.id)
    : [];

  Object.keys(permissions.value).forEach(groupName => {
    selectedGroups.value[groupName] = event;
  });
};

// Check if an entire group is selected
const isGroupSelected = (groupName) => {
  const groupPermissions = permissions.value[groupName] || [];
  return groupPermissions.every(permission => roleForm.value.permission_ids.includes(permission.id));
};

// Select/Deselect a Permission Group
const toggleSelectGroup = (groupName) => {
  const isSelected = !selectedGroups.value[groupName];
  selectedGroups.value[groupName] = isSelected;

  const groupPermissions = permissions.value[groupName] || [];
  if (isSelected) {
    roleForm.value.permission_ids.push(...groupPermissions.map(permission => permission.id));
  } else {
    roleForm.value.permission_ids = roleForm.value.permission_ids.filter(id => !groupPermissions.map(permission => permission.id).includes(id));
  }
};

// Watch for permission changes and update Select All state
watch(() => permissions.value, (newPermissions) => {
  if (allPermissionsSelected.value) {
    roleForm.value.permission_ids = Object.values(newPermissions).flat().map(permission => permission.id);
  }
});
</script>
