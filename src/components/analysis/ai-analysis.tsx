import { useEffect, useState, useRef } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { analyzeSymptoms } from '../../lib/ml-model';

interface AIAnalysisProps {
  symptoms: {
    mainSymptom: string;
    additionalInfo?: string;
  };
}

interface Analysis {
  condition: string;
  probability: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
}

export function AIAnalysis({ symptoms }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        const result = await analyzeSymptoms(
          `${symptoms.mainSymptom} ${symptoms.additionalInfo || ''}`
        );
        setAnalysis(result);

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      } catch (err) {
        setError('Failed to analyze symptoms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    performAnalysis();
  }, [symptoms]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
        <span className="ml-3 text-lg">Analyzing symptoms...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className="ml-3 text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <footer ref={resultsRef} className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-4">
      {/* Title Section */}
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold">Our Daktari's Analysis Results</h3>
      </div>

      {/* Possible Condition */}
      <div className="bg-orange-500 text-white p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-medium">Possible Condition</h4>
        <p className="text-white">{analysis.condition}</p>
      </div>

      {/* Confidence & Urgency Levels */}
      <div className="bg-gray-200 p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-medium text-gray-900">Confidence Level</h4>
        <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${analysis.probability * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {(analysis.probability * 100).toFixed(1)}% confidence
        </p>

        <h4 className="text-lg font-medium text-gray-900 mt-4">Urgency Level</h4>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            analysis.urgency === 'high'
              ? 'bg-red-600 text-white'
              : analysis.urgency === 'medium'
              ? 'bg-yellow-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          {analysis.urgency.charAt(0).toUpperCase() + analysis.urgency.slice(1)}
        </span>
      </div>

      {/* Recommendations */}
      <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
        <h4 className="text-lg font-medium">Recommendations</h4>
        <ul className="list-disc list-inside space-y-1">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
