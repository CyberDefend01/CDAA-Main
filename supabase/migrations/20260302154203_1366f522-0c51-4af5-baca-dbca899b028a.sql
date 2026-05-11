
-- Email logs table for tracking all emails sent
CREATE TABLE public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient text NOT NULL,
  email_type text NOT NULL,
  subject text,
  status text NOT NULL DEFAULT 'queued',
  priority text DEFAULT 'normal',
  tags text[] DEFAULT '{}',
  error_message text,
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  metadata jsonb DEFAULT '{}',
  sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view email logs
CREATE POLICY "Admins can manage email logs"
ON public.email_logs FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create index for analytics queries
CREATE INDEX idx_email_logs_type ON public.email_logs(email_type);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
CREATE INDEX idx_email_logs_created_at ON public.email_logs(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_email_logs_updated_at
  BEFORE UPDATE ON public.email_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
