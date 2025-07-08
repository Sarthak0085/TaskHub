import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CircleCheckBig } from 'lucide-react';
import Hero from '@/assets/hero.png';

export const HeroSection = ({ handleClick }: { handleClick: () => void }) => {
    return (
        <div className="flex flex-col-reverse lg:flex-row items-center gap-4">
            <div className="lg:w-[60%] w-[80%] pt-10 lg:pt-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold pb-1">
                    Get more done with <span className="text-blue-500">TaskHub</span>
                </h2>
                <p className="text-muted-foreground text-sm ">
                    The modern task management platform that helps teams <br /> to organize, track
                    and complete work effeciently
                </p>
                <div className="flex gap-2 pt-4">
                    <Link to={'/auth/sign-in'}>
                        <Button variant={'default'} className="w-[130px] font-semibold">
                            Try for free
                        </Button>
                    </Link>
                    <Link to={'#'}>
                        <Button
                            onClick={handleClick}
                            variant={'outline'}
                            className="w-[130px] font-semibold"
                        >
                            See Features
                        </Button>
                    </Link>
                </div>
                <div className="flex gap-4 pt-3">
                    <div className="flex items-center justify-center">
                        <CircleCheckBig className="size-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs">
                            No credit card required
                        </span>
                    </div>
                    <div className="flex items-center justify-center">
                        <CircleCheckBig className="size-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs">Free plan available</span>
                    </div>
                    <div className="flex items-center justify-center">
                        <CircleCheckBig className="size-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs">Cancel anytime</span>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-[40%] flex items-center justify-center">
                <img src={Hero} alt="hero" className="w-[80%] lg:w-full h-[200px] border" />
            </div>
        </div>
    );
};
