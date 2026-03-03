const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/100';
  if (url.startsWith('/minio')) return url;
  if (url.startsWith('http')) {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.pathname.startsWith('/minio')) {
        return parsedUrl.pathname;
      }
    } catch (e) {
    }
  }
  return url;
}
console.log(getImageUrl('http://192.168.10.6:3001/minio/products/123.jpg'));
