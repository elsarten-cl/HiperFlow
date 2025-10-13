'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateSocialMediaPost } from '@/ai/flows/generate-social-media-post';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Copy, CalendarPlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SocialPage() {
  const [topic, setTopic] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGeneratePost = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Topic is empty',
        description: 'Please describe the topic for your social media post.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedPost('');
    try {
      const result = await generateSocialMediaPost({ topicDescription: topic });
      setGeneratedPost(result.postContent);
      toast({ title: 'Post generated successfully!' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to generate post',
        description: 'An error occurred while communicating with the AI.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedPost);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  return (
    <>
      <PageHeader
        title="AI Social Scheduler"
        description="Generate and schedule engaging social media posts with AI."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Generator</CardTitle>
            <CardDescription>
              Describe your topic and let AI create a post for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="topic">Topic Description</Label>
              <Textarea
                placeholder="e.g., Announce our new integration with Stripe for seamless payments."
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGeneratePost} disabled={isLoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? 'Generating...' : 'Generate Post'}
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Generated Post</CardTitle>
            <CardDescription>Review, edit, and schedule your post.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <Textarea
                placeholder="Your generated post will appear here..."
                value={generatedPost}
                onChange={(e) => setGeneratedPost(e.target.value)}
                rows={8}
                className="font-code"
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCopyToClipboard} disabled={!generatedPost}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button disabled={!generatedPost}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule Post
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
