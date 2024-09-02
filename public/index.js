export default {
    data() {
      return {
        uploadedFileUrl: '',
        photos: []
      };
    },
    methods: {
      async uploadPhoto(event) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('photo', file);
  
        try {
          const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
          });
          const result = await response.json();
          this.uploadedFileUrl = result.fileUrl;
          this.loadPhotos(); // 사진 업로드 후 갤러리 갱신
        } catch (err) {
          console.error('Error uploading file:', err);
        }
      },
      async loadPhotos() {
        try {
          const response = await fetch('http://localhost:3000/photos');
          this.photos = await response.json();
        } catch (err) {
          console.error('Error loading photos:', err);
        }
      }
    },
    mounted() {
      this.loadPhotos(); // 컴포넌트가 마운트될 때 사진 리스트 로드
    }
  };