'use client'
import React, { useState } from 'react';
import { FiMail, FiCreditCard, FiTrendingUp, FiGrid } from 'react-icons/fi';

interface ToolCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const Ensemble: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const tools: ToolCard[] = [
    {
      title: "Scorecard Analytics",
      description: "Comprehensive performance metrics and KPI tracking system for data-driven decision making",
      icon: <FiCreditCard className="w-8 h-8" />,
      link: "/scorecard"
    },
    {
      title: "BlueMailer",
      description: "Professional email template editor with drag-and-drop interface and ready-to-use components",
      icon: <FiMail className="w-8 h-8" />,
      link: "/bluemailer"
    },
    {
      title: "Turnover Insights",
      description: "Advanced analytics tool for monitoring and optimizing business turnover metrics",
      icon: <FiTrendingUp className="w-8 h-8" />,
      link: "/turnover"
    },
    {
      title: "More Tools",
      description: "Explore our complete suite of business optimization and analytics tools",
      icon: <FiGrid className="w-8 h-8" />,
      link: "/tools"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Ensemble
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Your All-in-One Business Toolkit
          </p>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`mt-4 px-4 py-2 rounded-full ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-50 shadow-lg'
              }`}
            >
              <div className={`mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {tool.description}
              </p>
              <a
                href={tool.link}
                className={`inline-block px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Learn More
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <h2 className={`text-3xl font-bold mb-4 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
            Ready to Transform Your Business?
          </h2>
          <p className={`mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of businesses already using Ensemble to streamline their operations
          </p>
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity">
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ensemble; 