
'use client';

import { SectionHeading } from '@/components/section-heading';
import { SectionSubheading } from '@/components/section-subheading';
import { Card } from '@/components/ui/card';
import { Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

async function handleContactSubmit(data: ContactFormValues) {
    // This is a placeholder for a server action. In a real app, this would send an email or save to a DB.
    console.log('Contact form submitted:', data);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
}

export default function ContactPage() {
    const { toast } = useToast();
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
        name: '',
        email: '',
        message: '',
        },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
        await handleContactSubmit(data);
        toast({
            title: 'Message Sent!',
            description: "Thanks for reaching out. We'll get back to you shortly.",
        });
        form.reset();
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Uh oh!',
            description: 'There was a problem sending your message.',
        });
    }
  };

  return (
    <div className="container mx-auto py-16 md:py-24 px-4 md:px-0">
        <div className="text-center">
            <SectionHeading className="mb-6">Get in Touch</SectionHeading>
            <SectionSubheading className="mb-12">
                Have a question, a custom project in mind, or just want to say hello? We&apos;d love to hear from you.
            </SectionSubheading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="p-8">
                <h3 className="text-2xl font-headline font-semibold mb-6">Send us a Message</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                            <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Email</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Message</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Tell us how we can help..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Message
                    </Button>
                    </form>
                </Form>
            </Card>
             <div className="space-y-8">
                <div className="flex items-start gap-4">
                    <Phone className="h-8 w-8 text-primary mt-1 flex-shrink-0"/>
                    <div>
                        <h4 className="font-semibold text-lg">Phone</h4>
                        <p className="text-muted-foreground">Mon-Fri from 9am to 5pm.</p>
                        <a href="tel:+1234567890" className="text-primary hover:underline mt-1 block">+1 (234) 567-890</a>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Mail className="h-8 w-8 text-primary mt-1 flex-shrink-0"/>
                     <div>
                        <h4 className="font-semibold text-lg">Email</h4>
                        <p className="text-muted-foreground">For inquiries and support.</p>
                        <a href="mailto:hello@woodistore.com" className="text-primary hover:underline mt-1 block">hello@woodistore.com</a>
                     </div>
                </div>
                <div className="flex items-start gap-4">
                    <MapPin className="h-8 w-8 text-primary mt-1 flex-shrink-0"/>
                    <div>
                        <h4 className="font-semibold text-lg">Visit Us</h4>
                        <p className="text-muted-foreground">Our workshop and showroom.</p>
                        <p className="mt-1">123 Craftsmans Lane, Woodville, USA</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
