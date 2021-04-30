// if (document.getElementById('image-picker')) {
//   document.getElementById('image-picker').addEventListener('change', function (e) {
//     const formData = new FormData();
//     formData.append('img', this.files[0]);
//     axios.post('/post/img', formData)
//       .then((res) => {
//         console.log(res.data.url);
//         document.getElementById('editor-image').src = res.data.url;
//         document.getElementById('editor-image').style.display = 'block';
//       })
//       .catch((e) => {
//         console.error(e);
//       });
//   });
// }

function encodeBase64ImageFile(image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

const imagePicker = document.getElementById('image-picker');
const editorImage = document.getElementById('editor-image');
let thumbnail = '';
imagePicker.addEventListener('change', (e) => {
  encodeBase64ImageFile(e.target.files[0])
    .then((data) => {
      thumbnail = data;
      editorImage.src = thumbnail;
      editorImage.style.display = 'block';
    });
});

if (document.getElementById('submit-button')) {
  document.getElementById('submit-button').addEventListener('click', async (e) => {
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const content = quill.root.innerHTML;
    const category = document.getElementById('category').value.split(',');

    if (!title) {
      return alert('제목을 입력하세요');
    }
    try {
      const result = await axios.post('/post', {
        title, subtitle, content, thumbnail, category,
      });
      if (confirm(result.data.message)) {
        location.href = '/';
      }
    } catch (e) {
      alert(`등록이 실패했습니다.${e.stack}`);
      console.error(e);
    }
  });
}
