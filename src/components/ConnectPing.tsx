import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IcebreakerScreen } from "@/components/IcebreakerScreen";
import { toast } from "@/hooks/use-toast";
import { getDurhamVenues } from "@/lib/durham-venues";

interface ConnectPingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userId?: string;
  meetCode?: string;
  onSendRequest?: () => Promise<{ success: boolean; autoAccepted?: boolean }>;
  onStartTalking?: (data: { sharedEmojiCode: string; venueName: string; landmark: string }) => void;
}


export const ConnectPing = ({ open, onOpenChange, userName, userId, meetCode, onSendRequest, onStartTalking }: ConnectPingProps) => {
  const [status, setStatus] = useState<'sending' | 'sent'>('sending');

  const handleSend = async () => {
    if (onSendRequest) {
      const result = await onSendRequest();
      if (!result.success) {
        return;
      }
      // If auto-accepted, close the dialog
      if (result.autoAccepted) {
        onOpenChange(false);
        return;
      }
    }
    
    // Show sent status and close after a brief moment
    setStatus('sent');
    setTimeout(() => {
      onOpenChange(false);
      // Reset status for next time
      setStatus('sending');
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {status === 'sending' && `Connect with ${userName}?`}
              {status === 'sent' && 'Ping sent!'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {status === 'sending' && (
              <>
                <p className="text-sm text-muted-foreground">
                  Send a one-time ping to {userName}. They'll be notified and can choose to accept.
                </p>
                <Button onClick={handleSend} className="w-full gradient-warm shadow-soft rounded-full">
                  Send Connect Ping
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full rounded-full">
                  Cancel
                </Button>
              </>
            )}

            {status === 'sent' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center text-3xl">
                  ✓
                </div>
                <p className="text-sm font-medium mb-1">Request sent!</p>
                <p className="text-xs text-muted-foreground">
                  {userName} will be notified
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
  );
};
