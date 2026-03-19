import Hero from '../components/Hero';
import NewsFeed from '../components/NewsFeed';
import GithubTrending from '../components/GithubTrending';

export default function Home() {
  return (
    <>
      <Hero />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <NewsFeed limit={10} />
        </div>
        
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <GithubTrending />
          </div>
        </div>
      </div>
    </>
  );
}
