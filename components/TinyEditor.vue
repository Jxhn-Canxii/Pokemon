<template>
  <!-- Toggle Switch -->
  <div class="mb-4">
    <label class="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
      <input 
        type="checkbox" 
        v-model="isPremiumMode" 
        class="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
      />
      <span class="text-lg font-medium">
        {{ isPremiumMode ? "Premium Mode" : "Simple Mode" }}
      </span>
    </label>
  </div>

  <!-- TinyMCE Editor -->
  <Editor 
    :api-key="API_KEY"
    v-model="editorContent"
    :init="isPremiumMode ? premiumEditorOptions : simpleEditorOptions"
  />
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import Editor from "@tinymce/tinymce-vue";
import DOMPurify from "dompurify";

// Props to receive content from parent component
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

// Emits to send data to parent component
const emit = defineEmits(["update:modelValue"]);

// TinyMCE API Key
const API_KEY = "quk5w3ms9jbco46ck92acp9a6yls6wrc4eiodv3dlb0mf7ud";

// Reactive state
const editorContent = ref(props.content);
const isPremiumMode = ref(false); // Toggle between modes

// Simple mode options (basic features)
const simpleEditorOptions = {
  height: 300,
  plugins: "link lists wordcount",
  toolbar: "undo redo | bold italic underline | bullist numlist | link",
  menubar: false,
};

// Premium mode options (advanced features)
const premiumEditorOptions = {
  height: 500,
  plugins: "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss",
  toolbar: "undo redo | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
  tinycomments_mode: "embedded",
  tinycomments_author: "DIANE RESIDENCES",
};

// Watch for changes in the editor content and emit sanitized content
watch(editorContent, (newContent) => {
  const sanitizedContent = DOMPurify.sanitize(newContent);
  emit("update:modelValue", sanitizedContent);
});

// Watch for changes in parent content
watch(() => props.content, (newContent) => {
  if (newContent !== editorContent.value) {
    editorContent.value = newContent;
  }
});
</script>
