import { Card, CardHeader, CardTitle } from '@/components/ui/card.jsx'

import Reminders from './Reminders.jsx'
import Warnings from './Warnings.jsx'

function Home() {
  return (
    <div className="space-y-6">
      <Card className="bg-blue-500 text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Welcome Admin!
          </CardTitle>
        </CardHeader>
      </Card>
      <div className="flex flex-col gap-6">
        <Reminders />
        <Warnings />
      </div>
    </div>
  )
}

export default Home;
