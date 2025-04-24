import Swal from "sweetalert2";
import axios from "axios";
import { VUE_APP_API_URL } from "./Global";
import { ref } from 'vue';

export const FormDx = (obj, formData = new FormData(), namespace = '') => {
  for (const [key, value] of Object.entries(obj)) {
    const formKey = namespace ? `${namespace}[${key}]` : key;

    if (value instanceof Date) {
      formData.append(formKey, value.toISOString());
    } else if (value instanceof File) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      // Handle arrays, including empty arrays
      value.forEach((element, index) => {
        const tempKey = `${formKey}[${index}]`;
        if (typeof element === 'object' && element !== null) {
          FormDx(element, formData, tempKey); // Recursively handle nested objects in arrays
        } else {
          formData.append(tempKey, element);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects
      FormDx(value, formData, formKey);
    } else {
      // Handle primitive values
      formData.append(formKey, value);
    }
  }
  return formData;
};


export const BearToken = () => {
  const TOKEN =  localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'multipart/form-data', // Ensure this header for file uploads
    },
  };
};
export const handleApiError = (error) => {
  // Check if the response has an 'error' key and it's true
  if (error.response && error.response.status === 400) {
    Alerto('warning', 'Warning', error.response.data.message);
  }
  else if (error.response && error.response.status === 401) {
      Alerto('error', 'Invalid Token!', 'Token unauthenticated! Please login again.');
      // handleLogout();
  }
  // Handle request timeouts
  else if (error.code === 'ECONNABORTED') {
      Alerto('error', 'Request Timeout', 'The request took too long and was aborted. Please try again.');
  }
  // Handle forbidden access (403)
  else if (error.response && error.response.status === 403) {
      Alerto('error', 'Access Denied', 'You do not have permission to access this resource.');
  }
  // Handle not found errors (404)
  else if (error.response && error.response.status === 404) {
      Alerto('error', 'Not Found', 'The requested resource could not be found.');
  }
  // Handle server errors (500)
  else if (error.response && error.response.status >= 500 && error.response.status < 600) {
      Alerto('error', 'Server Error', 'There was a problem on the server. Please try again later.');
  }
  // Handle network errors
  else if (!error.response) {
      // Alerto('error', 'Warning', 'Please check your internet connection and try again.');
      console.log(error.response.message);
  }
  // Handle other errors
  else {
    console.log(error.response.message);
  }
};
const handleLogout = () => {
  // Clear all related authentication data
  localStorage.removeItem('token');
  // Redirect to login page or handle other logout actions
  window.location.href = '/'; // Redirect to login page (adjust path as needed)
};

export const JSONParser = (data) => {
  return JSON.parse(data);
}

export const JSONToString = (data) => {
  return JSON.stringify(data);
}
export const Hydra = () => {
  return {
      headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Credentials': true,
          'Sec-Fetch-Mode': no-cors,
          'Sec-Fetch-Site': cross-site,
      },
  };
}

//ALERTO((icon,title,message);
export const Alerto = (icon,title,message) => {
  return Swal.fire({
      icon: icon,
      title: title,
      text: message,
  });
}

export const replaceUnderScore = (text) => {
  // Split the text by underscores
  const words = text.split('_');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

  // Join the words back together with spaces
  const result = capitalizedWords.join(' ');

  return result;
};

export const replaceSpaceWithUnderScore = (text) => {
  // Split the text by spaces
  return text.replace(/\s/g, '_');
} 
export const useDebounce = (func, delay) => {
  //use delay if you want a custom delay debounce
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, 800);
  };
};

export const moneyFormatter = (number) => {
  // Ensure the input is a number
  if (isNaN(number)) {
      return 'Invalid input'; // Return a meaningful message or handle the error as needed
  }

  // Create a new NumberFormat object for PHP Peso
  const formatter = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  });

  // Format the number
  return formatter.format(number);
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

export const dateConverter = (date) => {
  const dateObject = new Date(date);

  // Get the components of the date
  const year = dateObject.getFullYear();
  const month = ("0" + (dateObject.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-indexed
  const day = ("0" + dateObject.getDate()).slice(-2);

  // Combine components to form "Y-m-d" format
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

export const addSecondsToTime = (time) => {
  return time += ":00";
};
export const removeSeconds = (time) => {
  console.log(time);
  if (time.endsWith(":00")) {
    // Remove the last ":00"
    time = time.slice(0, -3);
  }
};
export const convertTo12HourFormat = (time) => {
  console.log(time);
  // Check if time includes seconds and remove them if present
  if (time.endsWith(":00")) {
    time = time.slice(0, -3);
  }

  // Split the time into hours and minutes
  let [hours, minutes] = time.split(":").map(Number);

  // Determine AM/PM
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12; // Convert 0 to 12 for midnight

  // Return formatted time
  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
};
export const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

export const convertStringToArray = (str) => {
  try {
    // Replace single quotes with double quotes for valid JSON
    const sanitizedStr = str.replace(/'/g, '"');
    
    // Parse the sanitized string to get the array
    return JSON.parse(sanitizedStr);
  } catch (error) {
    console.error('Error parsing string to array:', error);
    return [];
  }
};
//convert date to timestamp Y-m-d H:i:s Format
export const dateToTimeStamp = (timestamp) => {
  const dateObject = new Date(timestamp);

  const year = dateObject.getFullYear();
  const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObject.getDate()).slice(-2);
  const hours = ("0" + dateObject.getHours()).slice(-2);
  const minutes = ("0" + dateObject.getMinutes()).slice(-2);
  const seconds = ("0" + dateObject.getSeconds()).slice(-2);

  // Combine components to form "Y-m-d H:i:s" format
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
};

export const dateNow = () => {
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  return formattedDate;
}