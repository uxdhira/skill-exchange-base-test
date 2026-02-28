import  Link  from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card1';
import { Button } from '@/components/ui/button1';
import { Badge } from '@/components/ui/badge1';
import { mockSkills, currentUser } from "@/data/mockData";
import { Plus, MapPin, Star, Edit, Trash2 } from 'lucide-react';

export default function MySkills() {
  const mySkills = mockSkills.filter(skill => skill.userId === currentUser.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Skills</h1>
          <p className="text-gray-600 mt-1">Manage the skills you are offering to the community</p>
        </div>
        <Link href ="/dashboard/submit-skill">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Skill
          </Button>
        </Link>
      </div>

      {mySkills.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No skills added yet</h3>
            <p className="text-gray-600 mb-4">Start sharing your expertise with the community</p>
            <Link href ="/dashboard/submit-skill">
              <Button>Add Your First Skill</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mySkills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{skill.category}</Badge>
                      <Badge variant="outline">{skill.skillLevel}</Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{skill.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{skill.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {skill.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {skill.userRating}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link href={`/dashboard/myskills/${skill.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
