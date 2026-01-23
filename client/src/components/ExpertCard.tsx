import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from "lucide-react";
import type { User } from "@shared/schema";

interface ExpertCardProps {
  expert: User;
  remedyCount?: number;
  rating?: number;
}

export default function ExpertCard({ expert, remedyCount = 0, rating = 4.9 }: ExpertCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border border-gray-100">
      <CardContent className="p-6 text-center">
        <div className="relative inline-block mb-4">
          <img
            src={`https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1582750433449-648ed127bb54' : '1612349317150-e413f6a5b16d'}?ixlib=rb-4.0.3&w=120&h=120&fit=crop&crop=face`}
            alt={`${expert.username} - Natural Health Expert | PlantRx`}
            loading="lazy"
            className="w-20 h-20 rounded-full mx-auto object-cover"
          />
          {expert.isVerified && (
            <CheckCircle className="w-6 h-6 text-sage absolute -bottom-1 -right-1 bg-white rounded-full" />
          )}
        </div>
        
        <div className="flex items-center justify-center space-x-2 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{expert.username}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">
          {(expert.expertCredentials as any)?.specialization || "Natural Health Specialist"}
        </p>
        
        <p className="text-gray-600 text-sm mb-4">
          {(expert.expertCredentials as any)?.experience || "Specializing in herbal medicine and holistic wellness"}
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>{remedyCount} Remedies</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <span>{rating}</span>
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span>Rating</span>
          </div>
        </div>
        
        {expert.expertStatus === "approved" && (
          <Badge className="mt-3 bg-green-100 text-green-600">
            Verified Expert
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
