import { CalendarCheck, Lock, Send, Signal, Users } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { HeroSection } from '@/components/home/hero';
import { useRef } from 'react';
import { CommonSection } from '@/components/home/common-section';
import { Footer } from '@/components/layout/footer';

const featuresData = [
    {
        icon: Users,
        title: 'Team Collaboration',
        description:
            'Work together seamlessly with your team in shared workspace with real time updates',
    },
    {
        icon: CalendarCheck,
        title: 'Task Management',
        description:
            'Organize tasks with priorities, due dates, comments and track progress visually',
    },
    {
        icon: Signal,
        title: 'Progress Tracking',
        description:
            ' Visualize project progress with beautiful charts and get insight into team productivity',
    },
];

const previewData = [
    {
        icon: Lock,
        title: 'Create an account',
        description: 'Sign Up for free and set your first workspace in seconds',
    },
    {
        icon: Users,
        title: 'Invite your team',
        description: 'Add your team members and start collaborating right away',
    },
    {
        icon: Send,
        title: 'Get things done',
        description: 'Create projects, assign tasks and track progress in real-time',
    },
];

export default function Home() {
    const featuresRef = useRef<HTMLDivElement | null>(null);

    const scrollToFeatures = () => {
        featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[75%] xl:w-[70%] mx-auto">
                {/* Header  */}
                <Header />

                {/* Hero Section */}
                <div className="mt-36 p-4">
                    <HeroSection handleClick={scrollToFeatures} />
                </div>

                {/* Features Section  */}
                <div ref={featuresRef} className="mt-36 p-16">
                    <CommonSection
                        sectionTitle="Our Features"
                        title="Everything you need to manage tasks effectively"
                        description="Our powerful features help teams stay organized and deliver projects on time"
                        data={featuresData}
                    />
                </div>

                {/* Preview Section  */}
                <div className="mt-24 p-16">
                    <CommonSection
                        sectionTitle="How it works"
                        title="Simple process, powerful results"
                        description="Get started in minutes and see improved team productivity"
                        data={previewData}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}
