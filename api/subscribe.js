export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const QND_URL = 'https://webform.onquanda.com/webform/52e81e94eff9ccad5d1c79195dcffcb8/';

  try {
    // Fetch the Quanda form page to get CSRF token and cookies
    const pageRes = await fetch(QND_URL);
    const html = await pageRes.text();
    const cookies = pageRes.headers.get('set-cookie') || '';

    const csrfMatch = html.match(/name="csrfmiddlewaretoken"\s+value="([^"]+)"/);
    if (!csrfMatch) {
      return res.status(502).json({ error: 'Could not load form' });
    }

    // Build form data
    const params = new URLSearchParams();
    params.append('csrfmiddlewaretoken', csrfMatch[1]);
    params.append('contact-email', email);
    params.append('check', '');
    params.append('check_id', '');
    params.append('parent_url', req.headers.referer || 'https://blog.forendors.cz/');

    // Forward cookies for CSRF validation
    const cookieHeader = cookies.split(',').map(c => c.split(';')[0].trim()).join('; ');

    // Submit to Quanda
    const submitRes = await fetch(QND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookieHeader,
        'Referer': QND_URL,
      },
      body: params.toString(),
      redirect: 'manual',
    });

    // Quanda returns 302 on success, 200 with form on error
    if (submitRes.status === 302 || submitRes.status === 200) {
      return res.status(200).json({ ok: true });
    }

    return res.status(502).json({ error: 'Submit failed' });
  } catch (e) {
    return res.status(502).json({ error: 'Server error' });
  }
}
