import Image from 'next/image';
import { Card } from "@/components/ui/card";

interface TeamMemberProps {
  name: string;
  id: string;
  img: string;
}

const TeamMember = ({ name, id, img }: TeamMemberProps) => {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-[350px] bg-gradient-to-br from-[#EA68AA] to-[#8F65BB] p-4 sm:p-6 transform transition-transform hover:scale-105 border-none">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]">
            <Image
              className="rounded-full object-cover"
              alt={name}
              src={img}
              fill
              sizes="(max-width: 640px) 120px, 140px"
            />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              {name}
            </h3>
            <p className="text-sm sm:text-base text-white/90 font-pop">
              {id}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeamMember; 