export default function useFetchFiles() {
  return async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileType = blob.type || "image/jpeg"; 
    return new File([blob], filename, { type: fileType });
  };
}
