import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { handleSignup } from "./routes.tsx";

const app = new Hono();

// Liste des emails admins autorisés
const ADMIN_EMAILS = ['tymeo.poncelet@gmail.com'];

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.log('Auth error:', error);
    return null;
  }
  
  return user;
}

// Middleware to verify admin
async function verifyAdmin(authHeader: string | null) {
  const user = await verifyUser(authHeader);
  
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return null;
  }
  
  return user;
}

// Health check endpoint
app.get("/make-server-181e480f/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== AUTH ENDPOINTS ==========

// Signup endpoint with auto email confirmation
app.post("/make-server-181e480f/auth/signup", handleSignup);

// ========== LIKES ENDPOINTS ==========

// Get likes for an edit
app.get("/make-server-181e480f/likes/:editId", async (c) => {
  try {
    const editId = c.req.param('editId');
    const likes = await kv.get(`likes:${editId}`) || [];
    
    return c.json({ 
      likes: likes,
      count: likes.length 
    });
  } catch (error) {
    console.error('Error getting likes:', error);
    return c.json({ error: 'Failed to get likes' }, 500);
  }
});

// Toggle like
app.post("/make-server-181e480f/likes/:editId", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const editId = c.req.param('editId');
    const likes = await kv.get(`likes:${editId}`) || [];
    
    const userLikeIndex = likes.findIndex((like: any) => like.userId === user.id);
    
    if (userLikeIndex !== -1) {
      // Remove like
      likes.splice(userLikeIndex, 1);
    } else {
      // Add like
      likes.push({ userId: user.id, createdAt: new Date().toISOString() });
    }
    
    await kv.set(`likes:${editId}`, likes);
    
    return c.json({ 
      likes: likes,
      count: likes.length,
      isLiked: userLikeIndex === -1
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return c.json({ error: 'Failed to toggle like' }, 500);
  }
});

// ========== COMMENTS ENDPOINTS ==========

// Get comments for an edit
app.get("/make-server-181e480f/comments/:editId", async (c) => {
  try {
    const editId = c.req.param('editId');
    const comments = await kv.get(`comments:${editId}`) || [];
    
    return c.json({ comments });
  } catch (error) {
    console.error('Error getting comments:', error);
    return c.json({ error: 'Failed to get comments' }, 500);
  }
});

// Add comment
app.post("/make-server-181e480f/comments/:editId", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const editId = c.req.param('editId');
    const { text } = await c.req.json();
    
    if (!text || !text.trim()) {
      return c.json({ error: 'Comment text is required' }, 400);
    }

    const comments = await kv.get(`comments:${editId}`) || [];
    
    const newComment = {
      id: Date.now().toString(),
      editId: parseInt(editId),
      userId: user.id,
      username: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.username || user.email || 'User')}&background=8ab4f8&color=fff`,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };
    
    comments.push(newComment);
    await kv.set(`comments:${editId}`, comments);
    
    return c.json({ comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    return c.json({ error: 'Failed to add comment' }, 500);
  }
});

// Delete comment
app.delete("/make-server-181e480f/comments/:editId/:commentId", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const editId = c.req.param('editId');
    const commentId = c.req.param('commentId');
    
    const comments = await kv.get(`comments:${editId}`) || [];
    const comment = comments.find((c: any) => c.id === commentId);
    
    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404);
    }
    
    if (comment.userId !== user.id) {
      return c.json({ error: 'Unauthorized to delete this comment' }, 403);
    }
    
    const filteredComments = comments.filter((c: any) => c.id !== commentId);
    await kv.set(`comments:${editId}`, filteredComments);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return c.json({ error: 'Failed to delete comment' }, 500);
  }
});

// ========== RATINGS ENDPOINTS ==========

// Get ratings for an edit
app.get("/make-server-181e480f/ratings/:editId", async (c) => {
  try {
    const editId = c.req.param('editId');
    const ratings = await kv.get(`ratings:${editId}`) || [];
    
    const average = ratings.length > 0
      ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
      : 0;
    
    return c.json({ 
      ratings,
      average,
      count: ratings.length
    });
  } catch (error) {
    console.error('Error getting ratings:', error);
    return c.json({ error: 'Failed to get ratings' }, 500);
  }
});

// Set rating
app.post("/make-server-181e480f/ratings/:editId", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const editId = c.req.param('editId');
    const { rating } = await c.req.json();
    
    if (!rating || rating < 1 || rating > 5) {
      return c.json({ error: 'Rating must be between 1 and 5' }, 400);
    }

    const ratings = await kv.get(`ratings:${editId}`) || [];
    
    const existingRatingIndex = ratings.findIndex((r: any) => r.userId === user.id);
    
    if (existingRatingIndex !== -1) {
      ratings[existingRatingIndex].rating = rating;
    } else {
      ratings.push({ 
        userId: user.id, 
        rating,
        createdAt: new Date().toISOString()
      });
    }
    
    await kv.set(`ratings:${editId}`, ratings);
    
    const average = ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length;
    
    return c.json({ 
      rating,
      average,
      count: ratings.length
    });
  } catch (error) {
    console.error('Error setting rating:', error);
    return c.json({ error: 'Failed to set rating' }, 500);
  }
});

// ========== ADMIN ENDPOINTS ==========

// Check if current user is admin
app.get("/make-server-181e480f/admin/check", async (c) => {
  try {
    const user = await verifyAdmin(c.req.header('Authorization'));
    
    if (!user) {
      return c.json({ isAdmin: false }, 403);
    }

    return c.json({ isAdmin: true, email: user.email });
  } catch (error) {
    console.error('Error checking admin:', error);
    return c.json({ isAdmin: false }, 500);
  }
});

// Get all users for admin panel (PROTECTED)
app.get("/make-server-181e480f/admin/users", async (c) => {
  try {
    // Verify admin access
    const admin = await verifyAdmin(c.req.header('Authorization'));
    if (!admin) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    // Use admin API to list all users
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching users:', error);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    // Format user data (passwords are never returned for security)
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      username: user.user_metadata?.username || 'N/A',
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
      emailConfirmed: user.email_confirmed_at ? true : false,
    }));

    return c.json({ users: formattedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Get all data for admin panel (PROTECTED)
app.get("/make-server-181e480f/admin/data", async (c) => {
  try {
    // Verify admin access
    const admin = await verifyAdmin(c.req.header('Authorization'));
    if (!admin) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 403);
    }

    // Get all likes
    const likesData = await kv.getByPrefix("like:");
    const likes = likesData.map((item: any) => {
      const [, editId, userId] = item.key.split(":");
      return { editId, userId };
    });

    // Get all comments
    const commentsData = await kv.getByPrefix("comments:");
    const comments = commentsData.flatMap((item: any) => {
      const [, editId] = item.key.split(":");
      return item.value.map((comment: any) => ({
        editId,
        ...comment
      }));
    });

    // Get all ratings
    const ratingsData = await kv.getByPrefix("rating:");
    const ratings = ratingsData.map((item: any) => {
      const [, editId, userId] = item.key.split(":");
      return { editId, userId, rating: item.value };
    });

    return c.json({
      likes,
      comments,
      ratings
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return c.json({ error: 'Failed to fetch data' }, 500);
  }
});

// ========== START SERVER ==========
Deno.serve(app.fetch);