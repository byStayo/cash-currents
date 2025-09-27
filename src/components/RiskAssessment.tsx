import React, { useState, useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, XCircle, User, TrendingUp, Home, Briefcase } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface RiskAssessmentProps {
  currentInflation?: number;
  currentInterest?: number;
}

interface AnswerOption {
  value: string;
  label: string;
  score: number;
}

interface Question {
  id: string;
  title: string;
  type: 'radio' | 'slider';
  options?: AnswerOption[];
  min?: number;
  max?: number;
}

interface RiskAnswers {
  [key: string]: string | number;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = memo(({
  currentInflation = 3.2,
  currentInterest = 7.5
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<RiskAnswers>({});

  const questions = [
    {
      id: 'age',
      title: 'Age Group',
      type: 'radio',
      options: [
        { value: '18-30', label: '18-30 years', score: 5 },
        { value: '31-45', label: '31-45 years', score: 4 },
        { value: '46-55', label: '46-55 years', score: 3 },
        { value: '56-65', label: '56-65 years', score: 2 },
        { value: '65+', label: '65+ years', score: 1 }
      ]
    },
    {
      id: 'income',
      title: 'Annual Household Income',
      type: 'radio',
      options: [
        { value: '<50k', label: 'Less than $50,000', score: 1 },
        { value: '50k-100k', label: '$50,000 - $100,000', score: 2 },
        { value: '100k-150k', label: '$100,000 - $150,000', score: 3 },
        { value: '150k-250k', label: '$150,000 - $250,000', score: 4 },
        { value: '250k+', label: 'More than $250,000', score: 5 }
      ]
    },
    {
      id: 'stability',
      title: 'Employment Stability',
      type: 'radio',
      options: [
        { value: 'very-stable', label: 'Very stable (government, tenured)', score: 5 },
        { value: 'stable', label: 'Stable (corporate, established company)', score: 4 },
        { value: 'moderate', label: 'Moderate (contract, commission-based)', score: 3 },
        { value: 'variable', label: 'Variable (seasonal, gig economy)', score: 2 },
        { value: 'uncertain', label: 'Uncertain (startup, volatile industry)', score: 1 }
      ]
    },
    {
      id: 'emergency_fund',
      title: 'Emergency Fund Coverage',
      type: 'radio',
      options: [
        { value: '6months+', label: '6+ months expenses', score: 5 },
        { value: '3-6months', label: '3-6 months expenses', score: 4 },
        { value: '1-3months', label: '1-3 months expenses', score: 3 },
        { value: '<1month', label: 'Less than 1 month', score: 2 },
        { value: 'none', label: 'No emergency fund', score: 1 }
      ]
    },
    {
      id: 'debt_ratio',
      title: 'Current Debt-to-Income Ratio',
      type: 'slider',
      min: 0,
      max: 80,
      step: 5,
      suffix: '%'
    },
    {
      id: 'dependents',
      title: 'Number of Dependents',
      type: 'radio',
      options: [
        { value: '0', label: 'No dependents', score: 5 },
        { value: '1-2', label: '1-2 dependents', score: 3 },
        { value: '3+', label: '3+ dependents', score: 1 }
      ]
    },
    {
      id: 'investment_experience',
      title: 'Investment Experience',
      type: 'radio',
      options: [
        { value: 'expert', label: 'Expert (10+ years)', score: 5 },
        { value: 'experienced', label: 'Experienced (5-10 years)', score: 4 },
        { value: 'moderate', label: 'Moderate (2-5 years)', score: 3 },
        { value: 'beginner', label: 'Beginner (< 2 years)', score: 2 },
        { value: 'none', label: 'No experience', score: 1 }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: string | number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculateRiskProfile = useCallback(() => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      if (question.type === 'radio' && answers[question.id]) {
        const selectedOption = question.options?.find(opt => opt.value === answers[question.id]);
        if (selectedOption) {
          totalScore += selectedOption.score;
          maxScore += 5;
        }
      } else if (question.type === 'slider' && answers[question.id] !== undefined) {
        // Debt ratio scoring (inverse - lower debt is better)
        const debtRatio = typeof answers[question.id] === 'number' ? answers[question.id] : 0;
        const score = Math.max(1, 5 - Math.floor((debtRatio as number) / 20));
        totalScore += score;
        maxScore += 5;
      }
    });

    const percentage = (totalScore / maxScore) * 100;
    
    let profile = 'Conservative';
    let recommendation = 'Focus on debt reduction and building emergency fund';
    let borrowingAdvice = 'Only borrow for essentials at lowest possible rates';
    
    if (percentage >= 80) {
      profile = 'Aggressive';
      recommendation = 'Consider strategic borrowing for investments and growth';
      borrowingAdvice = 'Leverage can be beneficial given your strong financial position';
    } else if (percentage >= 60) {
      profile = 'Moderate';
      recommendation = 'Balanced approach to borrowing and investing';
      borrowingAdvice = 'Borrow selectively for high-value opportunities';
    } else if (percentage >= 40) {
      profile = 'Conservative';
      recommendation = 'Prioritize financial stability and debt reduction';
      borrowingAdvice = 'Limit borrowing to essential needs only';
    } else {
      profile = 'Very Conservative';
      recommendation = 'Focus on building financial foundation first';
      borrowingAdvice = 'Avoid all non-essential borrowing';
    }

    return {
      score: totalScore,
      maxScore,
      percentage,
      profile,
      recommendation,
      borrowingAdvice
    };
  }, [answers, questions]);

  const riskProfile = useMemo(() => calculateRiskProfile(), [calculateRiskProfile]);
  const isComplete = Object.keys(answers).length === questions.length;

  // Risk factors visualization
  const riskFactors = useMemo(() => [
    { subject: 'Age', A: Math.min(5, (answers.age ? questions[0].options?.find(o => o.value === answers.age)?.score || 1 : 1)) },
    { subject: 'Income', A: Math.min(5, (answers.income ? questions[1].options?.find(o => o.value === answers.income)?.score || 1 : 1)) },
    { subject: 'Stability', A: Math.min(5, (answers.stability ? questions[2].options?.find(o => o.value === answers.stability)?.score || 1 : 1)) },
    { subject: 'Emergency Fund', A: Math.min(5, (answers.emergency_fund ? questions[3].options?.find(o => o.value === answers.emergency_fund)?.score || 1 : 1)) },
    { subject: 'Debt Level', A: Math.min(5, answers.debt_ratio !== undefined ? Math.max(1, 5 - Math.floor((typeof answers.debt_ratio === 'number' ? answers.debt_ratio : 0) / 20)) : 1) },
    { subject: 'Experience', A: Math.min(5, (answers.investment_experience ? questions[6].options?.find(o => o.value === answers.investment_experience)?.score || 1 : 1)) }
  ], [answers, questions]);

  const borrowingGuidelines = {
    'Very Conservative': {
      maxDebtRatio: 20,
      recommendedTypes: ['Essential housing', 'Emergency medical'],
      avoidTypes: ['Luxury items', 'Investments', 'Vacations'],
      color: 'text-risk'
    },
    'Conservative': {
      maxDebtRatio: 30,
      recommendedTypes: ['Mortgage', 'Education', 'Reliable vehicle'],
      avoidTypes: ['High-interest debt', 'Speculative investments'],
      color: 'text-warning'
    },
    'Moderate': {
      maxDebtRatio: 40,
      recommendedTypes: ['Real estate', 'Business investment', 'Quality education'],
      avoidTypes: ['Consumer debt', 'Volatile investments'],
      color: 'text-primary'
    },
    'Aggressive': {
      maxDebtRatio: 50,
      recommendedTypes: ['Strategic leverage', 'Investment properties', 'Business expansion'],
      avoidTypes: ['Unnecessary luxury debt'],
      color: 'text-beneficial'
    }
  };

  const currentGuideline = borrowingGuidelines[riskProfile.profile as keyof typeof borrowingGuidelines];

  if (!isComplete) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Risk Assessment
            <Badge variant="outline">{currentStep + 1}/{questions.length}</Badge>
          </CardTitle>
          <CardDescription>
            Complete this assessment to get personalized borrowing recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={(currentStep / questions.length) * 100} className="w-full" />
          
          {questions.map((question, questionIndex) => (
            <div key={question.id} className={questionIndex === currentStep ? 'block' : 'hidden'} role="tabpanel" aria-labelledby={`question-${question.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{question.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {question.type === 'radio' && (
                    <RadioGroup
                      value={String(answers[question.id] || '')}
                      onValueChange={(value) => handleAnswer(question.id, value)}
                    >
                      {question.options?.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  
                  {question.type === 'slider' && (
                    <div className="space-y-4">
                      <Label>{(typeof answers[question.id] === 'number' ? answers[question.id] : 0)}{question.suffix}</Label>
                      <Slider
                        min={question.min}
                        max={question.max}
                        step={question.step}
                        value={[typeof answers[question.id] === 'number' ? answers[question.id] as number : 0]}
                        onValueChange={([value]) => handleAnswer(question.id, value)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentStep(Math.min(questions.length - 1, currentStep + 1))}
                  disabled={!answers[question.id] && answers[question.id] !== 0}
                >
                  {currentStep === questions.length - 1 ? 'Complete' : 'Next'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Your Risk Profile Results
        </CardTitle>
        <CardDescription>
          Personalized borrowing recommendations based on your financial situation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className={`text-3xl font-bold ${currentGuideline.color}`}>
                    {riskProfile.profile}
                  </div>
                  <div className="text-sm text-muted-foreground">Risk Profile</div>
                  <Badge variant="outline" className="mt-2">
                    {riskProfile.percentage.toFixed(0)}% Risk Score
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Risk Tolerance</span>
                      <span>{riskProfile.score}/{riskProfile.maxScore}</span>
                    </div>
                    <Progress value={riskProfile.percentage} className="h-2" />
                  </div>

                  <div className="text-sm">
                    <div className="font-medium mb-2">Recommendation:</div>
                    <div className="text-muted-foreground">{riskProfile.recommendation}</div>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium mb-2">Borrowing Advice:</div>
                    <div className="text-muted-foreground">{riskProfile.borrowingAdvice}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4">Risk Factor Analysis</h4>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <RadarChart data={riskFactors}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" fontSize={12} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} fontSize={10} />
                      <Radar
                        name="Risk Score"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-beneficial" />
                  Recommended Borrowing
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Max Debt Ratio</span>
                    <Badge variant="outline">{currentGuideline.maxDebtRatio}%</Badge>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Suitable For:</div>
                    <div className="space-y-1">
                      {currentGuideline.recommendedTypes.map((type) => (
                        <div key={`recommended-${type}`} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-beneficial" />
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-risk" />
                  Avoid Borrowing For
                </h4>
                <div className="space-y-1">
                  {currentGuideline.avoidTypes.map((type) => (
                    <div key={`avoid-${type}`} className="flex items-center gap-2 text-sm">
                      <XCircle className="h-3 w-3 text-risk" />
                      {type}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-warning/5">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Key Considerations
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>• Current inflation rate: {currentInflation}%</div>
                  <div>• Average loan rate: {currentInterest}%</div>
                  <div>• Real borrowing cost: {(currentInterest - currentInflation).toFixed(1)}%</div>
                  <div className="pt-2 text-xs">
                    Your risk profile suggests {riskProfile.profile.toLowerCase()} borrowing strategies.
                    Consider inflation impact on loan repayments over time.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => {
                setAnswers({});
                setCurrentStep(0);
              }}
              variant="outline"
              className="w-full"
            >
              Retake Assessment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

RiskAssessment.displayName = 'RiskAssessment';