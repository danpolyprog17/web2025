'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface ProfileImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  disabled?: boolean;
}

export default function ProfileImageUpload({ 
  currentImage, 
  onImageChange, 
  disabled = false 
}: ProfileImageUploadProps) {
  const { update } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Принудительно обновляем сессию при загрузке компонента
  useEffect(() => {
    const updateSession = async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    };
    
    updateSession();
  }, [update]);

  // Принудительно обновляем сессию каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [update]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }
    
    // Проверяем размер файла (максимум 2MB для аватара)
    if (file.size > 2 * 1024 * 1024) {
      alert('Размер файла не должен превышать 2MB');
      return;
    }

    setIsUploading(true);

    try {
      // Создаем превью
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Загружаем файл на сервер
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        onImageChange(data.url);
      } else {
        throw new Error('Ошибка загрузки изображения');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Ошибка загрузки изображения');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-muted/50 flex items-center justify-center">
          {displayImage ? (
            <Image
              src={displayImage}
              alt="Profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        
        {displayImage && (
          <button
            type="button"
            onClick={removeImage}
            disabled={disabled || isUploading}
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <label className="cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={disabled || isUploading}
          />
          <div className={`ios-button-secondary text-sm px-4 py-2 ${
            disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            {isUploading ? 'Загружаем...' : '📷 Изменить фото'}
          </div>
        </label>
      </div>
    </div>
  );
}
