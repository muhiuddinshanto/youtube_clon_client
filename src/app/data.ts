
export const getVideosData = async () => {
const res = await fetch(`${process.env.NEXT_PUBLIC_API}/videos`, { cache: "no-store" });
const data = await res.json();
return data;
   
};


export const getVideosDataById = async (id: string) => {
const res = await fetch(`${process.env.NEXT_PUBLIC_API}/videos/${id}`, { cache: "no-store" });
const data = await res.json();
return data;
   
};