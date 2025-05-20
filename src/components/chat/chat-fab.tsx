import { useState, FormEvent, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useChatStore, useAuthStore } from '../../lib/store';
import { format } from 'date-fns';
import { analyzeSymptoms } from '../../lib/ml-model';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  text: string;
  sender: 'user' | 'doctor' | 'system';
  timestamp?: number;
  id: string;
};

export function ChatFAB() {
  const { isOpen, toggleChat, messages, addMessage } = useChatStore();
  const user = useAuthStore((state) => state.user);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasGreeted = messages.some(
    (msg) => msg.sender === 'system' && msg.text.includes('describe your symptoms')
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const message = input.value.trim();

    if (message) {
      const newMessage: Message = { 
        text: message, 
        sender: 'user', 
        timestamp: Date.now(), 
        id: `${Date.now()}` 
      };
      addMessage(newMessage);
      input.value = '';

      if (!hasGreeted) {
        setIsTyping(true);
        setTimeout(() => {
          const greetMessage: Message = {
            text: `Hello ${user?.username || 'patient'}, describe your symptoms to daktari 😊.`,
            sender: 'system',
            timestamp: Date.now(),
            id: `${Date.now()}`,
          };
          addMessage(greetMessage);
          setIsTyping(false);
        }, 1500);
      } else {
        setIsAnalyzing(true);
        setIsTyping(true);
        
        try {
          const analysis = await analyzeSymptoms(message);

          // Simulate typing for the analysis message
          setTimeout(() => {
            const analysisMessage: Message = {
              text: `Based on your symptoms, our doctor's analysis suggests:
              
Condition: ${analysis.condition}
Confidence: ${(analysis.probability * 100).toFixed(1)}%
Urgency: ${analysis.urgency.toUpperCase()}

Recommended Medications:
${analysis.medications.map((med) => `• ${med}`).join('\n')}

Other Recommendations:
${analysis.recommendations
                .filter((rec) => !analysis.medications.includes(rec))
                .map((rec) => `• ${rec}`)
                .join('\n')}

Consultation Fees:
• Initial consultation: KSH ${analysis.consultationFees.initial}
• Follow-up visit: KSH ${analysis.consultationFees.followUp}

If symptoms persist or worsen, please schedule a consultation with one of our doctors.`,
              sender: 'system',
              timestamp: Date.now(),
              id: `${Date.now()}`,
            };
            addMessage(analysisMessage);
          }, 2000);

          // Simulate typing for the thank you message
          setTimeout(() => {
            const thankYouMessage: Message = {
              text: 'Thank you for your message. Daktari will review your case shortly.',
              sender: 'system',
              timestamp: Date.now(),
              id: `${Date.now()}`,
            };
            addMessage(thankYouMessage);
            setIsTyping(false);
          }, 3500);
        } catch {
          toast.error('Failed to analyze symptoms. Please try again.');
          const errorMessage: Message = {
            text: 'Sorry, there was an error analyzing your symptoms. Daktari will review your case directly.',
            sender: 'system',
            timestamp: Date.now(),
            id: `${Date.now()}`,
          };
          addMessage(errorMessage);
          setIsTyping(false);
        } finally {
          setIsAnalyzing(false);
        }
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={toggleChat}
          className="rounded-full w-12 h-12 bg-blue-600 text-white shadow-lg transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 w-[90%] max-w-sm bg-white rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <div>
                <h3 className="text-lg font-semibold">Welcome to teleCure Health 🩺</h3>
                <p className="text-sm text-blue-100">Chat with our online doctor 👨‍⚕️</p>
              </div>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-blue-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="h-72 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 whitespace-pre-wrap shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : message.sender === 'system'
                        ? 'bg-teal-100 text-teal-800 rounded-bl-none'
                        : 'bg-green-500 text-white rounded-bl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {format(new Date(message.timestamp!), 'HH:mm')}
                  </span>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start space-x-2"
                >
                  <div className="bg-teal-100 text-teal-800 rounded-lg rounded-bl-none p-3 shadow-sm">
                    <div className="flex space-x-1">
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1, repeatDelay: 0.2 }}
                        className="inline-block w-2 h-2 bg-green-500 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2, repeatDelay: 0.2 }}
                        className="inline-block w-2 h-2 bg-green-500 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4, repeatDelay: 0.2 }}
                        className="inline-block w-2 h-2 bg-green-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="message"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 transition-all"
                  placeholder="Type your message..."
                  disabled={isAnalyzing}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all disabled:opacity-50"
                  disabled={isAnalyzing}
                >
                  Send
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}