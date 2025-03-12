import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaMagic, FaCode, FaTools, FaChartLine, FaRegQuestionCircle } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';

const LandingPage = () => {
  // Animation variants - simplified
  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div 
              className="text-center lg:text-left mb-10 lg:mb-0"
              initial="initial"
              animate="animate"
              variants={fadeIn}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
                Build websites <span className="text-primary">with AI</span> in seconds
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Transform your ideas into beautiful, functional websites using our powerful AI-powered 
                website generator. No coding required.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 shadow-sm transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  to="#how-it-works"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="lg:relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative bg-white rounded-lg ">
                <img 
                  className="w-full" 
                  src="/demo-website.png" 
                  alt="" 
                  
                />
                
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-sm font-medium tracking-wider text-primary uppercase">Features</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              Everything you need to build websites faster
            </p>
            <p className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto">
              Our AI-powered platform provides all the tools needed to go from idea to live website in minutes.
            </p>
          </motion.div>

          <motion.div 
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
            >
              <div className="mb-4 text-primary">
                <FaMagic className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">AI-Powered Generation</h3>
              <p className="mt-2 text-sm text-gray-600">
                Simply describe the website you want, and our AI will generate complete code in seconds.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
            >
              <div className="mb-4 text-primary">
                <FaCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Code Customization</h3>
              <p className="mt-2 text-sm text-gray-600">
                Edit the generated HTML, CSS, and JavaScript code with our built-in code editor.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
            >
              <div className="mb-4 text-primary">
                <FaRocket className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">One-Click Deploy</h3>
              <p className="mt-2 text-sm text-gray-600">
                Share your website instantly with a unique link or download the code for self-hosting.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
            >
              <div className="mb-4 text-primary">
                <FaTools className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Template Library</h3>
              <p className="mt-2 text-sm text-gray-600">
                Access a growing library of example prompts and templates to kickstart your project.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
            >
              <div className="mb-4 text-primary">
                <FaChartLine className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Project Management</h3>
              <p className="mt-2 text-sm text-gray-600">
                Organize all your website projects in one place with easy search and filtering options.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
            >
              <div className="mb-4 text-primary">
                <FaRegQuestionCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">AI Assistance</h3>
              <p className="mt-2 text-sm text-gray-600">
                Get AI-powered help with fixing issues or adding new features to your generated website.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-sm font-medium tracking-wider text-primary uppercase">How it works</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              Three simple steps to your new website
            </p>
            <p className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto">
              Our AI-powered platform simplifies the website creation process.
            </p>
          </motion.div>

          <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <span className="text-lg font-semibold">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Describe your website</h3>
              <p className="mt-2 text-sm text-gray-600">
                Simply describe what kind of website you want in plain English. Include details about design, 
                features, and functionality.
              </p>
              <div className="mt-4 bg-gray-50 p-3 rounded-md text-xs text-gray-600 italic">
                "I need a portfolio website for a photographer with a dark theme, image gallery, and a contact form."
              </div>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <span className="text-lg font-semibold">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">AI generates your website</h3>
              <p className="mt-2 text-sm text-gray-600">
                Our advanced AI analyzes your description and generates complete HTML, CSS, and JavaScript 
                code in seconds.
              </p>
              <div className="mt-4 flex gap-2">
                <div className="bg-gray-50 p-2 rounded-md flex-1 text-center">
                  <p className="text-xs text-gray-600 font-mono">HTML</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-md flex-1 text-center">
                  <p className="text-xs text-gray-600 font-mono">CSS</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-md flex-1 text-center">
                  <p className="text-xs text-gray-600 font-mono">JS</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                <span className="text-lg font-semibold">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Customize and deploy</h3>
              <p className="mt-2 text-sm text-gray-600">
                Edit the generated code using our built-in editor if needed, then share or download your website 
                with a single click.
              </p>
              <div className="mt-4 flex gap-2">
                <div className="bg-primary/10 p-2 rounded-md flex-1 text-center">
                  <p className="text-xs text-primary">Share Link</p>
                </div>
                <div className="bg-primary/10 p-2 rounded-md flex-1 text-center">
                  <p className="text-xs text-primary">Download</p>
                </div>
                <div className="bg-primary/10 p-2 rounded-md flex-1 text-center">
                  <p className="text-xs text-primary">Edit Code</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-sm font-medium tracking-wider text-primary uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              What our users are saying
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-gray-600 text-sm font-medium">JD</span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">John Doe</h3>
                  <p className="text-xs text-gray-500">Freelance Designer</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                "I'm not a developer, but I needed a website for my design portfolio. WebBuilder AI generated a stunning site in seconds that I could easily customize to match my brand."
              </p>
              <div className="mt-3 flex text-primary text-sm">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-gray-600 text-sm font-medium">SJ</span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">Sarah Johnson</h3>
                  <p className="text-xs text-gray-500">Small Business Owner</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                "I was quoted $2,500 for a basic business website. With WebBuilder AI, I created exactly what I wanted in under an hour, saving me thousands of dollars."
              </p>
              <div className="mt-3 flex text-primary text-sm">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-gray-600 text-sm font-medium">RP</span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">Robert Parker</h3>
                  <p className="text-xs text-gray-500">Web Developer</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                "As a developer, I use WebBuilder AI to quickly prototype ideas for clients. It gives me a solid foundation that I can then customize and expand upon."
              </p>
              <div className="mt-3 flex text-primary text-sm">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-sm font-medium tracking-wider text-primary uppercase">FAQ</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              Frequently asked questions
            </p>
          </motion.div>

          <div className="mt-6 space-y-4">
            <motion.div 
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-5"
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-base font-medium text-gray-900">How does WebBuilder AI work?</h3>
              <p className="mt-2 text-sm text-gray-600">
                WebBuilder AI uses advanced AI to generate complete website code based on your text descriptions. 
                It creates HTML, CSS, and JavaScript files that you can customize and deploy.
              </p>
            </motion.div>
            <motion.div 
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-5"
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="text-base font-medium text-gray-900">Do I need coding knowledge to use WebBuilder AI?</h3>
              <p className="mt-2 text-sm text-gray-600">
                No, you don't need any coding knowledge. Simply describe what you want in plain English, and the AI will generate the code for you. 
                However, if you know coding, you can edit the generated code to make advanced customizations.
              </p>
            </motion.div>
            <motion.div 
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-5"
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-base font-medium text-gray-900">How long does it take to generate a website?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Most websites are generated within 5-30 seconds, depending on complexity. 
                After generation, you can immediately view, edit, and deploy your website.
              </p>
            </motion.div>
            <motion.div 
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-5"
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="text-base font-medium text-gray-900">Can I host the generated websites anywhere?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Yes, you own 100% of the generated code. You can download the files and host them on any web hosting 
                service like Netlify, Vercel, GitHub Pages, or your own server.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to build your website with AI?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of users who are already creating stunning websites in seconds.
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 shadow-sm transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;
