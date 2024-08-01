import { Hono } from 'hono'

const app = new Hono()

app.get('/bulletin-news', async (c) => {
  try {
    const response = await fetch('https://directory.par.com.pk/frontend/webflow/bulletin-news');
    if (!response.ok) {
      throw new Error('PAR API is down');
    }
    const newsData = await response.json();

    if (!Array.isArray(newsData)) {
      throw new Error('Expected an array');
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const currentNews = newsData.find(item => item.date && item.date.split('T')[0] === currentDate);

    if (currentNews) {
      return c.json(currentNews);
    } else {
      return c.json({ message: 'No news for today' }, 404);
    }
  } catch (error) {
    return c.json({ message: (error as any).message }, 500);
  }
});

app.get('/find-news/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const response = await fetch(`https://directory.par.com.pk/frontend/webflow/find-news/${id}`);
    if (!response.ok) {
      throw new Error('PAR API is down');
    }
    const newsData = await response.json();

    if (!newsData) {
      throw new Error('News not found');
    }

    return c.json(newsData);
  } catch (error) {
    return c.json({ message: (error as any).message }, 500);
  }
});

export default app;