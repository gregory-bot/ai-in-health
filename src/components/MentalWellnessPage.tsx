import React, { useState } from 'react';
import { Sparkles, ClipboardCheck, BarChart3, MessageSquare, Send, Bot, RefreshCw, User, Users, Calendar, Lock, Phone, MapPin, AlarmClock, X, MessageCircle, MessageCircleMore } from 'lucide-react';

// Types
interface Question {
  id: number;
  text: string;
  scale: number[];
  labels: string[];
}

interface Assessment {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  nextMeeting: string;
  tags: string[];
  image: string;
}

interface EmergencyResource {
  id: string;
  name: string;
  phone: string;
  description: string;
  hours: string;
  website?: string;
}

// Data
const assessments: Assessment[] = [
  {
    id: 'phq9',
    name: 'Depression Screening',
    description: 'A validated 9-question tool to screen for the presence and severity of depression.',
    questions: [
      {
        id: 1,
        text: 'Little interest or pleasure in doing things',
        scale: [0, 1, 2, 3],
        labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
      },
      {
        id: 2,
        text: 'Feeling down, depressed, or hopeless',
        scale: [0, 1, 2, 3],
        labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
      },
      // Add more PHQ-9 questions here for a real assessment
    ]
  },
  {
    id: 'gad7',
    name: 'Anxiety Screening',
    description: 'A 7-question screening tool for generalized anxiety disorder.',
    questions: [
      {
        id: 1,
        text: 'Feeling nervous, anxious, or on edge',
        scale: [0, 1, 2, 3],
        labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
      },
      {
        id: 2,
        text: 'Not being able to stop or control worrying',
        scale: [0, 1, 2, 3],
        labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
      },
      // Add more GAD-7 questions here for a real assessment
    ]
  }
];

const supportGroups: SupportGroup[] = [
  {
    id: 'anxiety',
    name: 'Anxiety Support',
    description: 'A safe space to discuss anxiety, share coping techniques, and support each other through challenging times.',
    members: 248,
    nextMeeting: 'Tomorrow, 7:00 PM',
    tags: ['Anxiety', 'Stress', 'Coping Skills'],
    image: 'https://th.bing.com/th/id/OIP._O4S2JO1BSUyLmhkH3XLZgHaEK?cb=iwc2&rs=1&pid=ImgDetMain'
  },
  {
    id: 'depression',
    name: 'Depression Recovery',
    description: 'Connect with others who understand depression. Share experiences and strategies for managing symptoms.',
    members: 312,
    nextMeeting: 'Thursday, 6:30 PM',
    tags: ['Depression', 'Mood', 'Self-Care'],
    image: 'https://th.bing.com/th/id/OIP.2K_To1HeNnpIWFflqKkxPwHaJA?cb=iwc2&w=882&h=1073&rs=1&pid=ImgDetMain'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness Practice',
    description: 'Learn and practice mindfulness techniques together. Open to beginners and experienced practitioners alike.',
    members: 173,
    nextMeeting: 'Saturday, 10:00 AM',
    tags: ['Mindfulness', 'Meditation', 'Present Moment'],
    image: 'https://th.bing.com/th/id/OIP.UtX0_UXLxAYlc7JqCwGN6gHaE0?cb=iwc2&rs=1&pid=ImgDetMain'
  }
];

const emergencyResources: EmergencyResource[] = [
  {
    id: 'suicide-prevention',
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: 'Free and confidential support for people in distress, prevention and crisis resources.',
    hours: '24/7',
    website: 'https://988lifeline.org/'
  },
  {
    id: 'crisis-text',
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Free crisis counseling via text message.',
    hours: '24/7',
    website: 'https://www.crisistextline.org/'
  },
  {
    id: 'domestic-violence',
    name: 'National Domestic Violence Hotline',
    phone: '1-800-799-7233',
    description: 'Advocates are available to talk to anyone experiencing domestic violence.',
    hours: '24/7',
    website: 'https://www.thehotline.org/'
  }
];

// Helper functions for scoring and recommendations
function getAssessmentScore(assessment: Assessment, answers: Record<number, number>) {
  return assessment.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
}

function getAssessmentResult(assessment: Assessment, score: number) {
  if (assessment.id === 'phq9') {
    if (score <= 4) return { level: 'Minimal', advice: 'Your depression symptoms are minimal. Keep monitoring your mood and practice self-care.' };
    if (score <= 9) return { level: 'Mild', advice: 'Mild depression symptoms. Consider lifestyle changes and regular check-ins.' };
    if (score <= 14) return { level: 'Moderate', advice: 'Moderate symptoms. It may help to talk to a counselor or therapist.' };
    if (score <= 19) return { level: 'Moderately Severe', advice: 'Moderately severe symptoms. Professional support is recommended.' };
    return { level: 'Severe', advice: 'Severe symptoms. Please seek help from a mental health professional as soon as possible.' };
  }
  if (assessment.id === 'gad7') {
    if (score <= 4) return { level: 'Minimal', advice: 'Minimal anxiety. Keep up your self-care routines.' };
    if (score <= 9) return { level: 'Mild', advice: 'Mild anxiety. Try relaxation techniques and monitor your symptoms.' };
    if (score <= 14) return { level: 'Moderate', advice: 'Moderate anxiety. Consider speaking with a counselor.' };
    return { level: 'Severe', advice: 'Severe anxiety. Please consult a mental health professional.' };
  }
  return { level: 'Unknown', advice: 'No recommendation available.' };
}

// SOS Button Component
const SosButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full animate-ping bg-red-200 opacity-75"></div>
      <div className="absolute inset-0 rounded-full animate-ping bg-red-300 opacity-75 animation-delay-300"></div>
      <button
        onClick={onClick}
        className="relative bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-6 rounded-full w-40 h-40 border-4 border-red-700 shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 z-10"
      >
        <div className="flex flex-col items-center justify-center">
          <span className="text-3xl mb-1">SOS</span>
          <span className="text-sm">Emergency Help</span>
        </div>
      </button>
    </div>
  );
};

function App() {
  // Assessment State
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Chatbot State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hi there! I'm your wellness assistant. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showRiskAlert, setShowRiskAlert] = useState(false);

  // Crisis SOS State
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Assessment Handlers
  const handleAssessmentSelect = (id: string) => {
    setSelectedAssessment(id);
    setCurrentStep(0);
    setAnswers({});
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
    const assessment = assessments.find(a => a.id === selectedAssessment);
    if (assessment && currentStep < assessment.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const resetAssessment = () => {
    setSelectedAssessment(null);
    setCurrentStep(0);
    setAnswers({});
  };

  // Chatbot Handlers
const generateResponse = (userMessage: string): string => {
  const lowerCaseMessage = userMessage.toLowerCase();

  // Crisis detection
  if (
    lowerCaseMessage.includes('suicide') ||
    lowerCaseMessage.includes('kill myself') ||
    lowerCaseMessage.includes('want to die') ||
    lowerCaseMessage.includes('end my life')
  ) {
    setShowRiskAlert(true);
    return "I'm concerned about what you're sharing. You're not alone, and support is available. Would you like to talk to a counselor or see crisis resources?";
  }

  // Depression
  if (
    lowerCaseMessage.includes('sad') ||
    lowerCaseMessage.includes('depressed') ||
    lowerCaseMessage.includes('hopeless') ||
    lowerCaseMessage.includes('empty') ||
    lowerCaseMessage.includes('worthless') ||
    lowerCaseMessage.includes('no energy')
  ) {
    const suggestions = [
      "I'm sorry you're feeling this way. Sometimes writing down your thoughts or talking to a friend can help.",
      "Would you like to try a guided breathing exercise or a short gratitude activity?",
      "Remember, it's okay to ask for help. If you'd like, I can suggest some support groups or professional resources.",
      "Taking a short walk or listening to calming music might help lift your mood a bit.",
      "Would you like to hear a positive affirmation or a motivational quote?"
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  // Anxiety
  if (
    lowerCaseMessage.includes('anxious') ||
    lowerCaseMessage.includes('worried') ||
    lowerCaseMessage.includes('panic') ||
    lowerCaseMessage.includes('overwhelmed') ||
    lowerCaseMessage.includes('nervous') ||
    lowerCaseMessage.includes('racing heart')
  ) {
    const suggestions = [
      "Anxiety can be tough. Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
      "Would you like to try a short mindfulness exercise or a calming visualization?",
      "Remember to take slow, deep breaths. Inhale for 4 seconds, hold for 4, exhale for 4.",
      "If you're comfortable, you can share more about what's making you anxious. I'm here to listen.",
      "Would you like some tips for managing anxiety or information about support groups?"
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  // Sleep issues
  if (
    lowerCaseMessage.includes('can\'t sleep') ||
    lowerCaseMessage.includes('insomnia') ||
    lowerCaseMessage.includes('sleeping badly') ||
    lowerCaseMessage.includes('trouble sleeping')
  ) {
    return "Sleep issues are common. Try to keep a regular bedtime, avoid screens before bed, and practice relaxation techniques. Would you like a guided sleep meditation?";
  }

  // Stress
  if (
    lowerCaseMessage.includes('stressed') ||
    lowerCaseMessage.includes('burned out') ||
    lowerCaseMessage.includes('overwhelmed') ||
    lowerCaseMessage.includes('too much work')
  ) {
    return "Stress can build up quickly. Taking short breaks, stretching, or talking to someone you trust can help. Would you like a quick stress-relief exercise or to talk more about what's on your mind?";
  }

  // Loneliness
  if (
    lowerCaseMessage.includes('lonely') ||
    lowerCaseMessage.includes('alone') ||
    lowerCaseMessage.includes('isolated')
  ) {
    return "Feeling lonely is tough. Would you like to join a peer support group or connect with others who understand what you're going through?";
  }

  // Motivation
  if (
    lowerCaseMessage.includes('unmotivated') ||
    lowerCaseMessage.includes('no motivation') ||
    lowerCaseMessage.includes('can\'t focus')
  ) {
    return "Motivation can come and go. Setting small, achievable goals and celebrating little wins can help. Would you like some productivity tips or a motivational quote?";
  }

  // Default fallback
  return "Feel free to talk to teleCure health🙂, I'm here to listen and support you. Can you tell me more about how you're feeling or what you'd like help with?";
};

const handleSendMessage = () => {
  if (!inputValue.trim()) return;
  const userMessage: Message = {
    id: Date.now().toString(),
    sender: 'user',
    text: inputValue,
    timestamp: new Date()
  };
  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsThinking(true);
  setTimeout(() => {
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: generateResponse(userMessage.text),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botResponse]);
    setIsThinking(false);
  }, 1500);
};

const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
};

  // Crisis SOS Handlers
  const handleSOSClick = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setShowResourcesModal(true);
      },
      () => {
        setShowResourcesModal(true);
      }
    );
  };

  const callResource = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\D/g, '')}`;
  };

  const connectToLiveCounselor = () => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: "I'm connecting you with a counselor now. Please stay on this page. A counselor will join this conversation shortly.",
        timestamp: new Date()
      }
    ]);
    setShowRiskAlert(false);
  };

  const heroImages = [
    "https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://th.bing.com/th/id/OIP.aCFNQ4HBUV9RP00fm6tIwwHaEK?cb=iwc2&rs=1&pid=ImgDetMain",
    "https://actionchange.org/wp-content/uploads/2019/10/pict_large-6.jpg",
    "https://th.bing.com/th/id/OIP.UtX0_UXLxAYlc7JqCwGN6gHaE0?cb=iwc2&rs=1&pid=ImgDetMain",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* 2x2 Image Grid Background */}
        <div className="absolute inset-0 w-full h-full grid grid-cols-2 grid-rows-2 z-0">
          <img
            src={heroImages[0]}
            alt="Hero 1"
            className="object-cover w-full h-full"
            style={{ filter: "brightness(0.7)" }}
          />
          <img
            src={heroImages[1]}
            alt="Hero 2"
            className="object-cover w-full h-full"
            style={{ filter: "brightness(0.7)" }}
          />
          <img
            src={heroImages[2]}
            alt="Hero 3"
            className="object-cover w-full h-full"
            style={{ filter: "brightness(0.7)" }}
          />
          <img
            src={heroImages[3]}
            alt="Hero 4"
            className="object-cover w-full h-full"
            style={{ filter: "brightness(0.7)" }}
          />
        </div>
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="animate-fade-in-down">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Your Journey to Mental Wellness
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              A safe space to assess, connect, and nurture your mental health. All resources are private and confidential.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        {/* Assessment Section */}
        <section id="assessments" className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Self-Assessment Quizzes</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Use these scientifically validated tools to check in with your mental health. 
              Your results are private and stored securely to help track your progress.
            </p>
          </div>
          {!selectedAssessment ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {assessments.map((assessment) => (
                <div key={assessment.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <ClipboardCheck className="h-8 w-8 text-pink-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-800">{assessment.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{assessment.description}</p>
                    <button
                      onClick={() => handleAssessmentSelect(assessment.id)}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                      Start Assessment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
              {Object.keys(answers).length === assessments.find(a => a.id === selectedAssessment)?.questions.length ? (
                <div className="text-center">
                  <div className="mb-6">
                    <BarChart3 className="h-16 w-16 text-pink-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Assessment Complete</h3>
                    <p className="text-gray-600">Thank you for completing the assessment. Your results have been saved.</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-pink-800 mb-2">Your Score Summary</h4>
                    {(() => {
                      const assessment = assessments.find(a => a.id === selectedAssessment)!;
                      const score = getAssessmentScore(assessment, answers);
                      const result = getAssessmentResult(assessment, score);
                      return (
                        <>
                          <p className="text-gray-700 mb-2">
                            <span className="font-bold">Score:</span> {score} ({result.level})
                          </p>
                          <p className="text-gray-700">{result.advice}</p>
                        </>
                      );
                    })()}
                  </div>
                  <button
                    onClick={resetAssessment}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                  >
                    Take Another Assessment
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {assessments.find(a => a.id === selectedAssessment)?.name}
                    </h3>
                    <p className="text-gray-600">
                      Question {currentStep + 1} of {assessments.find(a => a.id === selectedAssessment)?.questions.length}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                      <div className="bg-pink-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${((currentStep + 1) / (assessments.find(a => a.id === selectedAssessment)?.questions.length || 1)) * 100}%`
                        }}>
                      </div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h4 className="text-xl font-medium text-gray-800 mb-4">
                      {assessments.find(a => a.id === selectedAssessment)?.questions[currentStep]?.text}
                    </h4>
                    <div className="space-y-3">
                      {assessments.find(a => a.id === selectedAssessment)?.questions[currentStep]?.scale.map((value, index) => {
                        const labels = assessments.find(a => a.id === selectedAssessment)?.questions[currentStep]?.labels;
                        return (
                          <button
                            key={index}
                            onClick={() => handleAnswer(assessments.find(a => a.id === selectedAssessment)?.questions[currentStep]?.id || 0, value)}
                            className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                              answers[assessments.find(a => a.id === selectedAssessment)?.questions[currentStep]?.id || 0] === value
                                ? 'bg-pink-100 border-2 border-pink-500'
                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                            }`}
                          >
                            {labels && labels[index]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={resetAssessment}
                      className="text-pink-600 hover:text-pink-800 font-medium transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    {currentStep > 0 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="text-pink-600 hover:text-pink-800 font-medium transition-colors duration-300"
                      >
                        Previous
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {/* Chatbot Section */}
        <section id="chatbot" className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">24/7 AI-Powered Support</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI assistant is here to listen, provide coping strategies, and guide you through difficult moments.
              All conversations are private and encrypted.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 text-white">
              <div className="flex items-center">
                <Bot className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="font-semibold text-lg">Wellness Assistant</h3>
                  <p className="text-sm opacity-90">Always here to listen</p>
                </div>
              </div>
            </div>
            
            {showRiskAlert && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Crisis Support Needed</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>We've detected that you might need additional support right now.</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={connectToLiveCounselor}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors duration-300"
                      >
                        Connect with Live Counselor Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="h-96 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-pink-100 text-gray-800 rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                    <div className="flex items-center mb-1">
                      {message.sender === 'bot' 
                        ? <Bot className="h-4 w-4 text-pink-600 mr-1" /> 
                        : <User className="h-4 w-4 text-blue-600 mr-1" />
                      }
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  placeholder="Type your message here..."
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isThinking}
                  className={`ml-3 rounded-full p-2 ${
                    !inputValue.trim() || isThinking
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-pink-600 text-white hover:bg-pink-700'
                  } transition-colors duration-300`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your conversations are private. If you're in immediate danger, please use the Crisis SOS button below.
              </p>
            </div>
          </div>
        </section>

        {/* Support Circles Section */}
        <section id="support-circles" className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Peer Support Circles</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with others who understand what you're going through. 
              All groups are moderated by mental health professionals to ensure a safe, supportive environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportGroups.map((group) => (
              <div key={group.id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="h-48 w-full relative">
                  <img 
                    src={group.image} 
                    alt={group.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl font-semibold">{group.name}</h3>
                      <div className="flex items-center mt-1">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">{group.members} members</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.tags.map((tag, index) => (
                      <span key={index} className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-gray-700 mb-4">
                    <Calendar className="h-4 w-4 mr-2 text-pink-600" />
                    <span className="text-sm">Next meeting: {group.nextMeeting}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
<a
  href="https://chat.whatsapp.com/Lf1ZO1iAybuGxnKV3ZiO5l"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
>
  <MessageCircle className="h-4 w-4 mr-2" />
  Join Group
</a>

                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <Lock className="h-4 w-4 mr-1" />
                      <span>Private</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">Don't see a group that fits your needs?</p>
            <button className="bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50 font-medium py-2 px-6 rounded-lg transition-colors duration-300">
              Suggest a New Group
            </button>
          </div>
        </section>

        {/* Crisis SOS Section */}
        <section id="crisis-sos" className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Crisis SOS Button</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Immediate access to emergency services and crisis hotlines with one tap.
              Your location can be shared with emergency services if neede
d (with your permission).
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-700 p-6">
              <h3 className="text-white text-2xl font-bold mb-2">One-Tap Emergency Access</h3>
              <p className="text-white/90">Press the SOS button to immediately access crisis resources and hotlines.</p>
            </div>
            
            <div className="p-8 flex flex-col items-center">
              <SosButton onClick={handleSOSClick} />
              
              <p className="mt-6 text-xl text-gray-500 text-center max-w-sm">
                This button is for mental health crises. For medical emergencies, please dial your local emergency number (911 in Nairobi).
              </p>
            </div>
          </div>

          {/* Crisis Resources Modal */}
          {showResourcesModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-red-600 p-4 flex justify-between items-center">
                  <h3 className="text-white text-xl font-bold">Crisis Resources</h3>
                  <button 
                    onClick={() => setShowResourcesModal(false)}
                    className="text-white hover:text-red-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {userLocation && (
                  <div className="p-4 bg-blue-50 border-b border-blue-100">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-800">Location Detected</h4>
                        <p className="text-sm text-blue-600">
                          Your approximate location has been detected. This can help find local resources.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg text-gray-800">Emergency Hotlines</h4>
                    
                    {emergencyResources.map((resource) => (
                      <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h5 className="font-semibold text-gray-800">{resource.name}</h5>
                        <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                        
                        <div className="flex flex-wrap gap-y-2 text-sm">
                          <div className="flex items-center mr-6">
                            <Phone className="h-4 w-4 text-red-600 mr-1" />
                            <span>{resource.phone}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <AlarmClock className="h-4 w-4 text-red-600 mr-1" />
                            <span>{resource.hours}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => callResource(resource.phone)}
                          className="mt-3 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-300 w-full"
                        >
                          Call Now
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-3">Local Emergency Services</h4>
                    <p className="text-gray-600">
                      For immediate danger or life-threatening emergencies, please call your local emergency number.
                    </p>
                    <button 
                      onClick={() => callResource('911')}
                      className="mt-3 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-300"
                    >
                      Call 911 (Nairobi Emergency Services)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
      {/* Footer */}
      <footer className="bg-black text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            {/* Logo and Brand Info */}
            <div className="flex-1 max-w-xs">
              <div className="flex items-center mb-4">
                <img
                  src="https://i.postimg.cc/hjmyGVDp/fave.png"
                  alt="teleCure Logo"
                  className="h-10 w-10 mr-3 rounded"
                />
                <span className="font-bold text-xl text-pink-200">teleCure</span>
              </div>
              <p className="text-blue-400 text-sm">
                Bridging the gap between patients and healthcare professionals through technology.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-col items-start md:items-center">
              <h3 className="text-pink-200 font-medium mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://x.com/teleCureAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.13 12.13 0 0 1 3.1 4.9a4.28 4.28 0 0 0 1.32 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.19c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 24 4.59a8.48 8.48 0 0 1-2.54.7z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.76 1.38-1.56 2.85-1.56 3.05 0 3.61 2.01 3.61 4.62v4.71z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-start">
              <h3 className="text-pink-200 font-medium mb-4">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Home</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Services</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">About Us</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Contact</a>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-start">
              <h3 className="text-pink-200 font-medium mb-4">Contact</h3>
              <address className="not-italic text-gray-400 text-sm space-y-2">
                <p>Nairobi 20200</p>
                <p>Nairobi - Kenya</p>
                <p>Phone: (254) 748 163 492</p>
                <p>Email: info@teleCure.com</p>
              </address>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} teleCure. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200 text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200 text-sm">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200 text-sm">Cookies</a>
              </div>
            </div>
            <p className="text-center text-gray-600 text-xs mt-4">
              Made with ❤️ by the teleCure team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;