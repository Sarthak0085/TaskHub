interface CommonSectionProps {
    sectionTitle: string;
    title: string;
    description: string;
    data: {
        icon: any;
        title: string;
        description: string;
    }[];
}

export const CommonSection = ({ sectionTitle, title, description, data }: CommonSectionProps) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="px-4 py-1 rounded-sm bg-gray-100">{sectionTitle}</div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold py-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
            <div className="pt-12 flex gap-6">
                {data?.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item?.title}
                            className="flex flex-col items-center justify-center"
                        >
                            <div className="rounded-full p-2 bg-blue-100 text-blue-500">
                                <Icon className="size-5" />
                            </div>
                            <h4 className="text-lg font-semibold">{item?.title}</h4>
                            <p className="text-muted-foreground text-sm text-center">
                                {item?.description}
                            </p>
                        </div>
                    );
                })}
                {/* <div className="flex flex-col items-center justify-center">
                <div className="rounded-full p-2 bg-blue-100 text-blue-500"> 
                  <data.icon className="size-5" />
                </div>
                <h4 className="text-lg font-semibold">Team Collaboration</h4>
                <p className="text-muted-foreground text-sm text-center">
                  Work together seamlessly with your team in shared workspace with real time updates
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full p-2 bg-blue-100 text-blue-500"> 
                  <CalendarCheck className="size-5" />
                </div>
                <h4 className="text-lg font-semibold">Task Management</h4>
                <p className="text-muted-foreground text-sm text-center">
                  Organize tasks with priorities, due dates, comments and track progress visually
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="rounded-full p-2 bg-blue-100 text-blue-500"> 
                  <Signal className="size-5" />
                </div>
                <h4 className="text-lg font-semibold">Progress Tracking</h4>
                <p className="text-muted-foreground text-sm text-center">
                  Visualize project progress with beautiful charts and get insight into team productivity
                </p>
              </div> */}
            </div>
        </div>
    );
};
