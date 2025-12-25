// import Image from 'next/image'
// import { metadataGenerators } from '@/lib/seo-helpers'
// import { HomeIcon } from 'lucide-react'
// import MainBtn from '@/components/ui/buttons/MainBtn'
// import bgImg from '../../public/images/random/circular-building.webp'

// export const metadata = metadataGenerators.notFound()

// export default function NotFound() {
//   return (
//     <main className="relative w-screen h-screen overflow-hidden bg-bg text-text flex justify-center items-center py-24 px-4 z-50">
//       <Image
//         src={bgImg}
//         alt="404"
//         fill
//         placeholder="blur"
//         sizes="100vw"
//         className="absolute inset-0 object-cover opacity-25 pointer-events-none -z-10"
//       />

//       <div className="flex flex-col gap-8 text-center">
//         <section className="space-y-4">
//           <h1 className="font-normal text-3xl">Our Apologies</h1>
//           <h3 className="text-3xl font-medium text-main">It seems you have reached a page that does not exist.</h3>
//           <p className="text-lg font-normal">Either the page is not available, or the address (URL) you have entered is incorrect.</p>
//           <MainBtn to={'/'} variant="ghost">
//             <span>Go Back Home</span>
//             <HomeIcon className="size-5" />
//           </MainBtn>
//         </section>

//         <section className="space-y-4 font-arab">
//           <h2 className="font-normal">نأسف</h2>
//           <h3 className="text-4xl font-medium">الصفحة المطلوبة غير موجودة</h3>
//           <p className="text-lg font-normal">قد يكون سبب المشكلة أن الصفحة غير متاحة، أو أن رابط الصفحة الذي أدخلته غير صحيح</p>
//         </section>
//       </div>
//     </main>
//   )
// }

export default function NotFound() {
  return <div></div>;
}
