import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import { analyzeSymptoms } from '../../lib/ml-model';
import { useState, useEffect } from 'react';
import { AIAnalysis } from '../analysis/ai-analysis';

const symptomSchema = z.object({
  mainSymptom: z.string().min(3, 'Please describe your main symptom'),
  duration: z.string().min(1, 'Please specify the duration'),
  severity: z.enum(['mild', 'moderate', 'severe']),
  additionalInfo: z.string().optional(),
});

const backgroundImages = [
  'https://images.pexels.com/photos/161449/medical-tablets-pills-drug-161449.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://media.istockphoto.com/id/1513072392/photo/hands-holding-paper-head-human-brain-with-flowers-self-care-and-mental-health-concept.jpg?b=1&s=612x612&w=0&k=20&c=boMJwSib2tbtpppWfjTiIkJLwHVLHipeRd8QzDE0Dl0='
];

export function SymptomForm() {
  const [analysis, setAnalysis] = useState<{
    condition: string;
    confidence: number;
    recommendations: string[];
    severity: string;
    duration: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(symptomSchema),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data: { mainSymptom: any; duration: any; severity: any; additionalInfo: any; }) => {
    setIsAnalyzing(true);
    try {
      const symptomText = `Patient reports ${data.mainSymptom}. ` +
        `This has been occurring for ${data.duration}. ` +
        `The severity is ${data.severity}. ` +
        (data.additionalInfo ? `Additional notes: ${data.additionalInfo}` : '');

      const result = await analyzeSymptoms(symptomText);

      const analysisResult = {
        condition: result.diagnosis || result.condition,
        confidence: result.confidence || 0.8,
        recommendations: result.recommendations || [],
        severity: data.severity,
        duration: data.duration
      };

      setAnalysis(analysisResult);
      toast.success('Symptoms analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Smooth Background Transition */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((img, index) => (
          <img
            key={img}
            src={img}
            alt="Background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Semi-transparent overlay for better readability */}
      <div className="absolute inset-0 z-0 bg-black/20"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-center">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">
              Symptom Analysis Portal
            </h2>
            <p className="mt-2 text-blue-100">
              Describe your symptoms to receive AI-powered health insights
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-5">
              {/* Main Symptom Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Main Symptom <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('mainSymptom')}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${
                    errors.mainSymptom ? 'border-red-300' : ''
                  }`}
                  rows={3}
                  placeholder="Describe your primary symptom in detail (e.g., severe headache with throbbing pain on the right side)"
                />
                {errors.mainSymptom && (
                  <p className="mt-1 text-sm text-red-600 animate-pulse">
                    {errors.mainSymptom?.message?.toString()}
                  </p>
                )}
              </div>

              {/* Duration Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('duration')}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${
                    errors.duration ? 'border-red-300' : ''
                  }`}
                  placeholder="How long have you experienced this? (e.g., 3 days, 2 weeks)"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600 animate-pulse">
                    {errors.duration?.message?.toString()}
                  </p>
                )}
              </div>

              {/* Severity Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Severity <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('severity')}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${
                    errors.severity ? 'border-red-300' : ''
                  }`}
                >
                  <option value="mild">Mild - Noticeable but not interfering with daily activities</option>
                  <option value="moderate">Moderate - Affecting some daily activities</option>
                  <option value="severe">Severe - Significantly impacting daily life</option>
                </select>
                {errors.severity && (
                  <p className="mt-1 text-sm text-red-600 animate-pulse">
                    {errors.severity?.message?.toString()}
                  </p>
                )}
              </div>

              {/* Additional Info Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <textarea
                  {...register('additionalInfo')}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  rows={3}
                  placeholder="Any other relevant information (e.g., symptoms worsen in the morning, associated with nausea, etc.)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] ${
                isSubmitting || isAnalyzing ? 'opacity-80 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting || isAnalyzing}
            >
              <span className="flex items-center justify-center">
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : isSubmitting ? 'Submitting...' : 'Analyze My Symptoms'}
              </span>
            </Button>
          </form>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="relative z-10 -mt-8 mx-auto max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 text-center">
            <h3 className="text-xl font-bold text-white">Analysis Results</h3>
          </div>
          <div className="p-6">
            <AIAnalysis
              symptoms={{
                mainSymptom: analysis.condition,
                severity: analysis.severity,
                duration: analysis.duration,
                confidence: analysis.confidence,
                recommendations: analysis.recommendations
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}