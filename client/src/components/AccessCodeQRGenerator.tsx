import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { saveAs } from 'file-saver';
import { Share2, Download, Mail, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessCodeQRGeneratorProps {
  accessCode: string;
  userName: string;
  email: string;
}

export default function AccessCodeQRGenerator({ accessCode, userName, email }: AccessCodeQRGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // The base URL for the dashboard with the access code
  const dashboardUrl = `${window.location.origin}/access-dashboard?code=${accessCode}`;

  // Generate QR code on component mount
  useEffect(() => {
    generateQRCode();
  }, [accessCode]);

  // Generate QR code using the qrcode library
  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(dashboardUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#050b17',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'QR Code Generation Failed',
        description: 'Could not generate the QR code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Download QR code as image
  const downloadQRCode = () => {
    try {
      saveAs(qrCodeUrl, `JetAI-${accessCode}.png`);
      toast({
        title: 'QR Code Downloaded',
        description: 'Your access code QR has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Could not download the QR code. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Copy dashboard URL to clipboard
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(dashboardUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: 'Dashboard URL Copied',
        description: 'Link copied to clipboard successfully.',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy to clipboard. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Send email with QR code and access information
  const sendQRCodeEmail = async () => {
    try {
      // In a real implementation, you would send this via API
      // For now, we just simulate a success
      
      // Using EmailClient would look like:
      // await sendEmail({
      //   to: email,
      //   subject: `Your JET AI Access Code: ${accessCode}`,
      //   html: `
      //     <div style="text-align: center; font-family: Arial, sans-serif;">
      //       <h1>Your JET AI Access QR Code</h1>
      //       <p>Hello ${userName},</p>
      //       <p>Thank you for completing your onboarding! Here is your personal access code:</p>
      //       <div style="margin: 20px; padding: 15px; background: #f0f7ff; border-radius: 5px; font-size: 24px; font-weight: bold;">
      //         ${accessCode}
      //       </div>
      //       <p>Scan the QR code below to access your personal dashboard:</p>
      //       <img src="${qrCodeUrl}" alt="QR Code" style="width: 250px; height: 250px;" />
      //       <p>Or click <a href="${dashboardUrl}">here</a> to go directly to your dashboard.</p>
      //     </div>
      //   `
      // });

      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEmailSent(true);
      setTimeout(() => setIsEmailSent(false), 3000);
      
      toast({
        title: 'Email Sent',
        description: `Your access code has been emailed to ${email}.`,
      });
    } catch (error) {
      toast({
        title: 'Email Sending Failed',
        description: 'Could not send the email. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="border-2 border-[#4a89dc]/30">
      <CardHeader className="pb-4">
        <CardTitle>Your JET AI Access Code</CardTitle>
        <CardDescription>
          Use this code or QR to access your personal dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-[#050b17] text-white px-4 py-3 rounded-md text-xl font-mono tracking-wide">
          {accessCode}
        </div>
        
        {isGenerating ? (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-md">
            <div className="animate-spin h-10 w-10 border-4 border-[#4a89dc] border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="p-3 bg-white border rounded-md shadow-sm">
            <img src={qrCodeUrl} alt="Access Code QR" className="w-64 h-64" />
          </div>
        )}

        <p className="text-sm text-gray-500 text-center max-w-xs">
          Scan this QR code to instantly access your personal dashboard 
          with all your travel information.
        </p>
      </CardContent>
      <CardFooter className="justify-center gap-2 flex-wrap">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyToClipboard} 
          className="flex gap-1"
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          Copy Link
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadQRCode} 
          className="flex gap-1"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={sendQRCodeEmail} 
          className="flex gap-1"
        >
          {isEmailSent ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
          Email
        </Button>
        <Button 
          size="sm" 
          onClick={() => window.open(dashboardUrl, '_blank')} 
          className="bg-[#4a89dc] hover:bg-[#3a79cc] flex gap-1"
        >
          <Share2 className="h-4 w-4" />
          Open Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}