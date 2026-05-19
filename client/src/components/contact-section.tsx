import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  insertContactMessageSchema,
  type InsertContactMessage,
} from "@shared/schema";

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  const { toast } = useToast();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to send message");
      }

      return result;
    },

    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description:
          "Thanks for reaching out. We'll get back to you soon.",
      });

      reset();
    },

    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: "fas fa-envelope",
      title: "Email",
      value: "hello@appsanitycustoms.com",
      bgColor: "bg-primary/20",
      iconColor: "text-primary",
    },
    {
      icon: "fas fa-phone",
      title: "Phone",
      value: "+61 493 322 661",
      bgColor: "bg-secondary/20",
      iconColor: "text-secondary",
    },
    {
      icon: "fas fa-map-marker-alt",
      title: "Location",
      value: "Melbourne, AU",
      bgColor: "bg-accent/20",
      iconColor: "text-accent",
    },
  ];

  return (
    <section id="contact" className="py-20 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-center mb-16 text-gradient"
        >
          Let's Create Together
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg text-muted-foreground mb-8">
              Ready to bring your vision to life? Let's discuss your next
              project and create something extraordinary together.
            </p>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.1,
                  }}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <i className={`${info.icon} ${info.iconColor}`} />
                  </div>

                  <div>
                    <p className="font-semibold">{info.title}</p>
                    <p className="text-muted-foreground">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="form-floating">
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  placeholder=" "
                  className="w-full px-4 py-4 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <label htmlFor="name">Your Name</label>

                {errors.name && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="form-floating">
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder=" "
                  className="w-full px-4 py-4 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <label htmlFor="email">Email Address</label>

                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="form-floating">
                <input
                  {...register("subject")}
                  type="text"
                  id="subject"
                  placeholder=" "
                  className="w-full px-4 py-4 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <label htmlFor="subject">Subject</label>

                {errors.subject && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="form-floating">
                <textarea
                  {...register("message")}
                  id="message"
                  rows={5}
                  placeholder=" "
                  className="w-full px-4 py-4 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
                <label htmlFor="message">Your Message</label>

                {errors.message && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={contactMutation.isPending}
                className="btn-modern w-full py-4 rounded-lg text-primary-foreground font-semibold disabled:opacity-50"
              >
                {contactMutation.isPending
                  ? "Sending..."
                  : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}