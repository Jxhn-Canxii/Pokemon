<template>
  <div>
    <!-- Add Role Button -->
    <UButton icon="i-heroicons-user-plus" color="blue" @click="roleBehavior">
      Add Role
    </UButton>

    <!-- Add Role Modal -->
    <Modalx :show="isAddRoleModalOpen" title="Add Role" @close="isAddRoleModalOpen = false" :maxWidth="'2xl'">
      <UCard>
        <UForm @submit.prevent="addRole" class="space-y-4">
          <UFormGroup label="Role Name" required>
            <UInput
              v-model="roleForm.role_name"
              placeholder="Enter Role Name"
              :class="{ 'border-red-500': errors.role_name }"
            />
            <p v-if="errors.role_name" class="text-red-500 text-sm mt-1">
              {{ errors.role_name[0] }}
            </p>
          </UFormGroup>

          <!-- User Permissions -->
          <h3 class="text-md font-semibold">User Permissions</h3>

          <UCheckbox
            :checked="allPermissionsSelected"
            @change="toggleSelectAllPermissions"
          >
            Select All
          </UCheckbox>

          <div class="divide-y divide-gray-200 border-t border-dashed">
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

const isAddRoleModalOpen = ref(false);

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

// Emits event when role is added
const emits = defineEmits(["transaction_id"]);

// Open Modal and Fetch Permissions
const roleBehavior = () => {
  isAddRoleModalOpen.value = true;
  listPermissions();
};

// Fetch Permissions
const listPermissions = async () => {
  try {
    const formData = FormDx({ encryption_key: "Joke!" });
    const response = await axios.post(`${VUE_APP_API_URL}permissions/list-no-page`, formData, BearToken());

    if (response.data && response.data.permissions) {
      const groupedPermissions = {};
      response.data.permissions.forEach(permission => {
        if (!groupedPermissions[permission.type]) {
          groupedPermissions[permission.type] = [];
        }
        groupedPermissions[permission.type].push(permission);
      });

      permissions.value = groupedPermissions;
    } else {
      console.error("Permissions data is not available", response.data);
    }
  } catch (error) {
    handleApiError(error);
  }
};

// Submit Role Form
const addRole = async () => {
  try {
    errors.value = {}; // Reset errors
    const formData = FormDx(roleForm.value);
    const response = await axios.post(`${VUE_APP_API_URL}roles/add-role`, formData, BearToken());

    isAddRoleModalOpen.value = false;
    Alerto("success", "Success", response.data.message);
    clearRoleForm();
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

// Clear Role Form
const clearRoleForm = () => {
  roleForm.value.role_id = 0;
  roleForm.value.role_name = "";
  roleForm.value.permission_ids = [];
  allPermissionsSelected.value = false;
  selectedGroups.value = {};
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
