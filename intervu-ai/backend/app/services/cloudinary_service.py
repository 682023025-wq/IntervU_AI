"""
Cloudinary Service - Upload gambar ke Cloudinary
"""
import cloudinary
import cloudinary.uploader
from app.core.config import settings


class CloudinaryService:
    """Service untuk upload gambar ke Cloudinary"""
    
    def __init__(self):
        self._configure()
    
    def _configure(self):
        """Configure Cloudinary"""
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True
        )
    
    async def upload_image(
        self,
        file_bytes: bytes,
        folder: str = "intervu",
        public_id: str = None
    ) -> dict:
        """
        Upload image to Cloudinary
        Returns: {secure_url, public_id, format}
        """
        try:
            # Convert bytes to base64 for Cloudinary
            import base64
            base64_image = base64.b64encode(file_bytes).decode('utf-8')
            data_uri = f"data:image/jpeg;base64,{base64_image}"
            
            upload_params = {
                "folder": folder,
                "resource_type": "image",
                "transformation": [
                    {"width": 800, "height": 800, "crop": "limit"},  # Max size
                    {"quality": "auto:good"}  # Auto quality
                ]
            }
            
            if public_id:
                upload_params["public_id"] = public_id
            
            result = cloudinary.uploader.upload(data_uri, **upload_params)
            
            return {
                "secure_url": result.get("secure_url"),
                "public_id": result.get("public_id"),
                "format": result.get("format")
            }
            
        except Exception as e:
            print(f"Cloudinary upload error: {e}")
            raise Exception(f"Failed to upload image: {str(e)}")
    
    async def upload_avatar(self, file_bytes: bytes, user_id: str) -> dict:
        """Upload avatar image"""
        return await self.upload_image(
            file_bytes,
            folder="intervu/avatars",
            public_id=f"avatar_{user_id}"
        )
    
    async def upload_cv_photo(self, file_bytes: bytes, user_id: str) -> dict:
        """
        Upload CV photo (3x4)
        Optimized for formal CV
        """
        return await self.upload_image(
            file_bytes,
            folder="intervu/cv_photos",
            public_id=f"cv_photo_{user_id}",
        )
    
    def get_upload_preset_url(self) -> str:
        """
        Get Cloudinary upload URL for direct browser upload
        Frontend bisa upload langsung tanpa melalui backend
        """
        return f"https://api.cloudinary.com/v1_1/{settings.CLOUDINARY_CLOUD_NAME}/image/upload"


# Singleton instance
cloudinary_service = CloudinaryService()
