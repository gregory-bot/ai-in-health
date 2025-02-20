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

const backgroundVideos = [
  'https://media.istockphoto.com/id/487962955/video/vital-signs-monitor.mp4?s=mp4-640x640-is&k=20&c=mhgzsSNCMUXUAgBrP7ZWvkCeJ_DhZGAVIRIpJpQ_jC0=',
  'https://videos.pexels.com/video-files/5863354/5863354-hd_1080_1920_29fps.mp4',
  'https://videos.pexels.com/video-files/5453774/5453774-uhd_2560_1440_25fps.mp4'
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
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
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % backgroundVideos.length);
        setIsTransitioning(false);
      }, 500); // Transition duration
    }, 9000); // Change video every 9 seconds

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data: { mainSymptom: any; duration: any; severity: any; additionalInfo: any; }) => {
    setIsAnalyzing(true);
    try {
      // Format the symptom text for analysis
      const symptomText = `Patient reports ${data.mainSymptom}. ` +
        `This has been occurring for ${data.duration}. ` +
        `The severity is ${data.severity}. ` +
        (data.additionalInfo ? `Additional notes: ${data.additionalInfo}` : '');

      const result = await analyzeSymptoms(symptomText);
      
      // Transform the result into the expected format
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
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {backgroundVideos.map((video, index) => (
          <video
            key={video}
            src={video}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              currentVideoIndex === index ? 'opacity-100' : 'opacity-0'
            } ${isTransitioning ? 'scale-105' : 'scale-100'}`}
          />
        ))}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
            describe your symptoms to daktari
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-green-700">Main Symptom</span>
                <textarea
                  {...register('mainSymptom')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Example: severe headache with throbbing pain on the right side"
                />
                {errors.mainSymptom && (
                  <p className="mt-1 text-sm text-red-600">{errors.mainSymptom?.message?.toString()}</p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-green-700">Duration</span>
                <input
                  type="text"
                  {...register('duration')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Example: 3 days, 2 weeks, etc."
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration?.message?.toString()}</p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-green-700">Severity</span>
                <select
                  {...register('severity')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="mild">Mild - Noticeable but not interfering with daily activities</option>
                  <option value="moderate">Moderate - Affecting some daily activities</option>
                  <option value="severe">Severe - Significantly impacting daily life</option>
                </select>
                {errors.severity && (
                  <p className="mt-1 text-sm text-red-600">{errors.severity?.message?.toString()}</p>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-green-700">Additional Information</span>
                <textarea
                  {...register('additionalInfo')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Example: symptoms worsen in the morning, associated with nausea, etc."
                />
              </label>
            </div>

            <Button
              type="submit"
              className={`w-full py-3 rounded-md bg-red-600 text-white font-medium hover:bg-blue-700 transition-colors ${
                isSubmitting || isAnalyzing ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting || isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing Symptoms...' : isSubmitting ? 'Submitting...' : 'Submit Symptoms'}
            </Button>
          </form>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="relative z-10 mt-8 mx-auto max-w-2xl bg-white rounded-lg shadow-xl p-8">
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
      )}
    </div>
  );
}