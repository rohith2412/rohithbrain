import List from "@/components/List"

export const metadata = {
  title: 'Home',
  description: 'Discover articles on recipes, technology, lifestyle, health, finance, and more.',
  alternates: {
    canonical: '/'
  }
}

export default function Home() {


  return (
    <main className="">
      <List />
    </main>
  )
}