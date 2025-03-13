const axios = require('axios');
const User = require('../models/User');

// Generate website code from prompt
exports.generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = req.user;

    // Check if user has reached daily prompt limit
    if (user.hasReachedPromptLimit()) {
      return res.status(429).json({ 
        message: 'Daily prompt limit reached (2 prompts per day)' 
      });
    }

    // Update user's prompt usage
    user.promptsUsedToday += 1;
    await user.save();

    // Format the prompt for better results
    const formattedPrompt = `Generate a fully responsive, modern, and minimal website with a clean UI based on the following description. The design should use smooth animations, a mobile-first approach, and follow 2025 web design trends.
       WEBSITE SPECIFICATIONS:
     - Use semantic HTML5 elements for better accessibility and SEO
     - Implement responsive design with proper breakpoints (mobile:      360px, tablet: 768px, desktop: 1200px+)
     - Optimize for performance with modern CSS techniques (Grid/     Flexbox)
     - Include proper image optimization with responsive sizing
     
    
    For any images needed(may use this not compolsory), use this pattern in JavaScript:
    fetch('https://web-builder-ai-backend.vercel.app/api/images?query=KEYWORD')
      .then(res => res.json())
      .then(data => {
        // data.images contains array of {url, alt} objects
        // Use these URLs to set image sources
      });
    
    USER REQUEST: ${prompt}
    
    Please respond with three sections clearly marked:
    
    ### HTML CODE ###
    (full HTML code here)
    
    ### CSS CODE ###
    (full CSS code here)
    
    ### JAVASCRIPT CODE ###
    (JavaScript code here, include image fetching if needed)`;

    // Call Perplexity API using axios
    const options = {
      method: 'POST',
      url: 'https://api.perplexity.ai/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: 'sonar',
        messages: [
          { role: 'system', content: "You are a coding assistant specializing in modern UI/UX design. Generate well-structured, responsive, and aesthetically pleasing websites using only HTML, CSS, and vanilla JavaScript. Your designs should be minimalist and modern, inspired by ShadCN UI and Magic UI. Ensure mobile-friendliness with flexbox, grid, and media queries. Implement smooth and interactive elements using subtle animations, transitions, and hover effects. Apply well-styled CSS techniques, including gradients, glassmorphism, and neumorphism where needed, to create visually appealing user interfaces. Do not add any explanations, introductions, or extra text. Strictly follow this format:\n\n### HTML CODE ###\n<Insert HTML here>\n\n### CSS CODE ###\n<Insert CSS here>\n\n### JAVASCRIPT CODE ###\n<Insert JavaScript here>" },
          { role: 'user', content: formattedPrompt }
        ],
        max_tokens: 10000
      }
    };

    try {
      const apiResponse = await axios(options);
      const response = apiResponse.data;
      
      // Check if response has the expected structure
      if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
        throw new Error('Invalid API response structure: ' + JSON.stringify(response));
      }

      // Extract code sections from response
      const content = response.choices[0].message.content;
      
      // Validate content exists
      if (!content) {
        throw new Error('No content received from API');
      }

      // Helper function to clean markdown code blocks
      const cleanMarkdownCodeBlocks = (code) => {
        return code.replace(/```(?:html|css|javascript)?\n?/gi, '').replace(/```\n?/g, '');
      };

      // Parse content to extract HTML, CSS, and JavaScript
      const htmlMatch = content.match(/### HTML CODE ###\s*([\s\S]*?)(?=### CSS CODE ###|$)/i);
      const cssMatch = content.match(/### CSS CODE ###\s*([\s\S]*?)(?=### JAVASCRIPT CODE ###|$)/i);
      const jsMatch = content.match(/### JAVASCRIPT CODE ###\s*([\s\S]*?)(?=$)/i);

      const htmlCode = htmlMatch ? cleanMarkdownCodeBlocks(htmlMatch[1].trim()) : '';
      const cssCode = cssMatch ? cleanMarkdownCodeBlocks(cssMatch[1].trim()) : '';
      const jsCode = jsMatch ? cleanMarkdownCodeBlocks(jsMatch[1].trim()) : '';

      res.json({
        success: true,
        htmlCode,
        cssCode,
        jsCode
      });
    } catch (error) {
      console.error('Generator error:', error);
      res.status(500).json({ 
        message: 'Failed to generate website', 
        error: error.response?.data || error.message 
      });
    }
  } catch (error) {
    console.error('Generator error:', error);
    res.status(500).json({ 
      message: 'Failed to generate website', 
      error: error.response?.data || error.message 
    });
  }
};

// Get example prompts to help users
exports.getExamplePrompts = async (req, res) => {
  try {
    const examplePrompts = [
      "Create a landing page for a fitness app with a modern design, sign-up form, and feature highlights",
      "Build a portfolio website for a photographer with image gallery and contact form",
      "Design a restaurant website with menu, reservation form, and location map",
      "Make a tech blog homepage with article cards, newsletter signup, and dark mode toggle",
      "Create a travel agency website with destination cards, booking form, and testimonials",
      "Build an e-commerce product page with image carousel, pricing, and add to cart button",
      "Design a personal resume website with skills, experience, and downloadable CV",
      "Create a SaaS landing page with pricing table, feature list, and FAQ section"
    ];
    
    res.json({ examplePrompts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
