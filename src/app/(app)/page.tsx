"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

function Home() {
  return (
    <>
      <main className="flex  flex-col items-center justify-between p-6 sm:p-12 lg:p-24">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Send anonymous messages, where your thoughts are free and your
            identity stays hidden.
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg">
            Welcome to Anonymus Messages, where every message is anonymous and
            every voice is valued.
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg font-semibold">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="w-full bg-transparent text-gray-700 py-6">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <p className="text-sm md:text-base font-bold">
            © 2025 Anonymous Messages. All rights reserved.
          </p>
          <p className="text-xs md:text-sm mt-2 font-bold">
            Made with ❤️ to empower voices everywhere.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 text-sm md:text-base font-bold"
            >
              Privacy Policy
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 text-sm md:text-base font-bold"
            >
              Terms of Service
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 text-sm md:text-base font-bold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
