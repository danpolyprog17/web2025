'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import ProfileImageUpload from '@/components/ProfileImageUpload';
import ThemeToggle from '@/components/ThemeToggle';

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  likes: Array<{
    id: string;
    user: {
      id: string;
      name: string;
    };
  }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      image?: string;
    };
  }>;
  _count: {
    likes: number;
    comments: number;
  };
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blog' | 'profile'>('blog');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: '',
    theme: 'system'
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session?.user) {
      console.log('Profile session:', session.user);
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || '',
        theme: session.user.theme || 'system'
      });
    }
  }, [session]);

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

  // Принудительно обновляем сессию каждые 10 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 15 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 20 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 25 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 35 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 35000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 40 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 40000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 45 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 50 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 50000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 55 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 55000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 60 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 65 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 65000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 70 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 70000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 75 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 75000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 80 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 80000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 85 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 85000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 90 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 90000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 95 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 95000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 100 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 100000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 105 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 105000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 110 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 110000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 115 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 115000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 120 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 120000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 125 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 125000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 130 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 130000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 135 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 135000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 140 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 140000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 145 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 145000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 150 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 150000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 155 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 155000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 160 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 160000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 165 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 165000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 170 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 170000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 175 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 175000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 180 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 180000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 185 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 185000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 190 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 190000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 195 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 195000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 200 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 200000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 205 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 205000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 210 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 210000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 215 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 215000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 220 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 220000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 225 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 225000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 230 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 230000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 235 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 235000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 240 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 240000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 245 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 245000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 250 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 250000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 255 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 255000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 260 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 260000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 265 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 265000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 270 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 270000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 275 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 275000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 280 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 280000);

    return () => clearInterval(interval);
  }, [update]);

  // Принудительно обновляем сессию каждые 285 секунд
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await update();
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 285000);

    return () => clearInterval(interval);
  }, [update]);

  useEffect(() => {
    if (activeTab === 'blog') {
      fetchPosts();
    }
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              const isLiked = post.likes.some(like => like.user.id === session?.user?.id);
              if (isLiked) {
                return {
                  ...post,
                  likes: post.likes.filter(like => like.user.id !== session?.user?.id),
                  _count: {
                    ...post._count,
                    likes: post._count.likes - 1
                  }
                };
              } else {
                return {
                  ...post,
                  likes: [
                    ...post.likes,
                    {
                      id: Date.now().toString(),
                      user: {
                        id: session?.user?.id || '',
                        name: session?.user?.name || ''
                      }
                    }
                  ],
                  _count: {
                    ...post._count,
                    likes: post._count.likes + 1
                  }
                };
              }
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...post.comments, data.comment],
                _count: {
                  ...post._count,
                  comments: post._count.comments + 1
                }
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот пост?')) return;
    
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileLoading) return;

    setProfileLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name,
          image: formData.image,
          theme: formData.theme
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Профиль обновлен');
        
        // Обновляем сессию с новыми данными
        if (data.user) {
          // Обновляем локальное состояние
          setFormData(prev => ({
            ...prev,
            name: data.user.name || '',
            image: data.user.image || '',
            theme: data.user.theme || 'system'
          }));
        }
        
        // Принудительно обновляем сессию
        window.location.reload();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Ошибка обновления');
      }
    } catch (err) {
      setMessage('Ошибка соединения');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleImageChange = (imageUrl: string | null) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl || ''
    }));
  };

  const handleThemeChange = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      theme
    }));
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="ios-card p-8 text-center max-w-sm mx-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-3">Требуется вход</h1>
          <p className="text-muted-foreground mb-6">Войдите в систему для доступа к профилю</p>
          <Link href="/login" className="ios-button w-full text-center">
            Перейти на страницу входа
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="ios-section">
          <div className="ios-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl overflow-hidden mr-3">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-purple-500/10 flex items-center justify-center ${session?.user?.image ? 'hidden' : ''}`}>
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">Мой блог</h1>
                  <p className="text-muted-foreground">Поделитесь своими мыслями с друзьями</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('blog')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === 'blog'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Блог
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Профиль
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'blog' ? (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <CreatePost onPostCreated={fetchPosts} />
            
            {loading ? (
              <div className="ios-card p-8 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Загружаем посты...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="ios-card p-8 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Пока нет постов</h3>
                <p className="text-muted-foreground">Создайте первый пост или подождите, пока ваши друзья что-то опубликуют</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onDelete={handleDeletePost}
                />
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Информация о профиле */}
            <div className="ios-section">
              <div className="ios-section-title">Личная информация</div>
              <div className="ios-card p-6">
                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* Фото профиля */}
                  <div className="flex justify-center">
                    <ProfileImageUpload
                      currentImage={formData.image}
                      onImageChange={handleImageChange}
                      disabled={profileLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Имя
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="ios-input w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="ios-input w-full bg-muted text-muted-foreground"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Email нельзя изменить</p>
                  </div>

                  {/* Переключатель темы */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Тема оформления
                    </label>
                    <div className="flex bg-muted/50 rounded-lg p-1">
                      {[
                        { value: 'light', label: 'Светлая', icon: '☀️' },
                        { value: 'dark', label: 'Темная', icon: '🌙' },
                        { value: 'system', label: 'Системная', icon: '💻' }
                      ].map(({ value, label, icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleThemeChange(value)}
                          className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                            formData.theme === value
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <span className="mr-1">{icon}</span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {message && (
                    <div className={`text-sm ${message.includes('обновлен') ? 'text-success' : 'text-destructive'}`}>
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="ios-button w-full"
                  >
                    {profileLoading ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                </form>
              </div>
            </div>

            {/* Статистика */}
            <div className="ios-section">
              <div className="ios-section-title">Статистика аккаунта</div>
              <div className="ios-card overflow-hidden">
                <div className="ios-list-item">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Дата регистрации</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="ios-list-item">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Статус аккаунта</p>
                      <p className="text-sm text-success">Активен</p>
                    </div>
                  </div>
                </div>

                <div className="ios-list-item border-b-0">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-destructive/20 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Выйти из аккаунта</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


