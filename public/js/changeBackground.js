const changeBackgroundButton = document.getElementById('change-image');
const image = document.getElementById('background-image');
const preview = document.getElementById('background-image-preview');
let imageSrc = '';

image.addEventListener('change', (e) => {
  imageSrc = e.target.files[0];
});

changeBackgroundButton.addEventListener('click', () => {
  const formData = new FormData();
  formData.append('img', imageSrc);
  // axios.post('/background', formData).then((data) => console.log(data));
  axios.post('/background', formData).then(() => {
    location.reload();
  });
});
