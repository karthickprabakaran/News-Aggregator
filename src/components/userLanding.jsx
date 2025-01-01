import React from 'react';
import { ArrowRight, Globe, Zap, Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function UserLanding() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center justify-center px-4 bg-cover bg-tile relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.pexels.com/photos/1752724/pexels-photo-1752724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          animation: "fadeIn 2s ease-in-out",
        }}
      >
        <div className="container mx-auto text-center">
          <h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent mb-6"
            style={{
              animation: "textFadeIn 2.5s ease-in-out",
            }}
          >
            Stay Informed, Stay Ahead
          </h1>
          <p
            className="text-lg md:text-xl text-white font-bold dark:text-gray-300 mb-10 max-w-2xl mx-auto"
            style={{
              animation: "textFadeIn 3s ease-in-out",
            }}
          >
            Get real-time news updates from trusted sources worldwide, personalized
            to your interests
          </p>
          <Link
            to="/news"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              animation: "buttonFadeIn 3.5s ease-in-out",
            }}
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        <style>
          {`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: scale(1.1);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }

            @keyframes textFadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes buttonFadeIn {
              from {
                opacity: 0;
                transform: translateY(40px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </section>

      {/* Features Section */}

      <section className="min-h-screen flex items-center justify-center py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
      Features
    </h2>
    <div className="grid md:grid-cols-3 gap-12">
      {[
        {
          icon: Globe,
          title: "Wide Coverage",
          description: "Access news from over All States in multiple languages",
        },
        {
          icon: Zap,
          title: "Real-time Updates",
          description: "Get breaking news alerts and live coverage of major events",
        },
        {
          icon: Shield,
          title: "Verified Sources",
          description: "Trust in our curated network of reliable news providers",
        },
      ].map(({ icon: Icon, title, description }, index) => (
        <div
          key={title}
          className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow transform scale-95 hover:scale-100 animate-fadeInUp"
          style={{
            animationDelay: `${index * 0.2}s`,
            animationFillMode: "forwards",
          }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
            <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      ))}
    </div>
  </div>
  <style>
    {`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fadeInUp {
        animation: fadeInUp 0.8s ease-in-out;
      }
    `}
  </style>
</section>


      {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to stay updated?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of readers who trust our platform for their daily news
          </p>
          <Link
            to="/news"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Browse News
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default UserLanding;
