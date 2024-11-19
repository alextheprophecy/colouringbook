import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();
    
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                {t('about.title')}
            </h1>
            
            {/* Contact Container */}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    {t('about.contact.title')}
                </h2>
                
                <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href="mailto:crayonsme.dev@gmail.com" className="text-blue-600 hover:text-blue-800 text-lg">
                            crayonsme.dev@gmail.com
                        </a>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700">-</span>
                    </div>

                    {/* Address */}
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-700">
                            -
                        </span>
                    </div>
                </div>
            </div>

            {/* AI Technology Stack Container */}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    {t('about.ai.title')}
                </h2>

                <div className="space-y-8">
                    {/* ChatGPT Section */}
                    <div className="border-b border-gray-200 pb-6">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {t('about.ai.chatgpt.title', 'Language AI Models')}
                            </h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            {t('about.ai.chatgpt.description')}
                            <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:text-blue-800">OpenAI's</a>
                            <span className="font-bold"> GPT-4, GPT-4-mini </span>
                            {t(' models to power various aspects of our platform:')}
                        </p>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                                <span>Generating prompts for our AI image models</span>
                            </li>
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                                <span>Processing and understanding user requests</span>
                            </li>
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                                <span>Maintaining narrative consistency across coloring book stories</span>
                            </li>
                        </ul>
                    </div>

                    {/* Image Generation Section */}
                    <div>
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {t('about.ai.image.title', 'AI Image Generation')}
                            </h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            {t('about.ai.image.description', 'We utilize ')}
                            <a href="https://blackforestlabs.ai" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:text-blue-800">Black Forest Labs'</a>
                            {t(' AI models combined with specialized fine-tuning to create perfect coloring book pages:')}
                        </p>
                        <ul className="space-y-4 text-gray-600">                            
                            <li className="flex items-start">
                                <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"/>
                                <div>
                                    <span className="font-medium">Flux 1.1 Pro</span>
                                    <p className="text-sm mt-1">Advanced model for complex, detailed colouring pages</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="flex-shrink-0  w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"/>
                                <div>
                                    <span className="font-medium">Flux Dev with Custom LoRA</span>
                                    <p className="text-sm mt-1">Good model using specialized fine-tuned LoRA weights by LamEmy on civitai</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <div className="flex-shrink-0  w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"/>
                                <div>
                                    <span className="font-medium">Flux Schnell</span>
                                    <p className="text-sm mt-1">Basic model for quick, reliable coloring page generation</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
