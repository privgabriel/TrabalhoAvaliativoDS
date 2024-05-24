"use client";

import {ref, onValue, remove, push} from "firebase/database";
import { db } from "@/services/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import Link from "next/link";
import {auth} from "@/services/firebase/firebaseConfiguration";
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";



interface IMetas {
  [key: string]: {
    tipo: string;
    data_conclusao: string;
    data_inicio: string;
    descricao: string;
    status: string;
    titulo: string;
  };
}

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [metas, setMetas] = useState<IMetas>({});

    const [authUser, setAuthUser] = useState(null);
    const { userAuth } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Usuário logado: ", user.uid);
                setAuthUser(user);
                router.push("/");
            } else {
                console.log("Usuário deslogado");
                setAuthUser(null);
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = () => {
            const metasRef = ref(db, "/metas");
            const unsubscribe = onValue(metasRef, (querySnapShot) => {
                const tasksData: IMetas = querySnapShot.val() || {};
                console.log(tasksData);
                setMetas(tasksData);
                setLoading(false);
            });

            return () => unsubscribe();
        };

        fetchData();
    }, []);

    function clearUser(userKey: string) {
        const userRef = ref(db, `/metas/${userKey}`);
        remove(userRef);
    }

  return (
      <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-12">
          {!loading &&
              Object.keys(metas).map((userId) => (
                  <div key={userId} className="relative py-3">
                    <div className="max-w-md mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                          {loading
                              ? "Carregando..."
                              : `${metas[userId].titulo}`.toUpperCase()}
                        </h2>
                        <div className="my-4">
                          <p className="text-gray-700">{`ID: ${userId}`}</p>
                          <p className={"text-gray-700"}>{`Nome: ${metas[userId].titulo}`}</p>
                          <p className="text-gray-700">{`Tipo: ${metas[userId].tipo}`}</p>
                          <p className="text-gray-700">{`Data de Início: ${metas[userId].data_inicio}`}</p>
                          <p className="text-gray-700">{`Data de Conclusão: ${metas[userId].data_conclusao}`}</p>
                          <p className="text-gray-700">{`Descrição: ${metas[userId].descricao}`}</p>
                          <p className="text-gray-700">{`Status: ${metas[userId].status}`}</p>

                          <div className="flex justify-center space-x-4 mt-4">
                            <Link href={`/meta/${userId}`}>
                              <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                                Detalhes
                              </button>
                            </Link>
                            <button
                                onClick={() => clearUser(userId)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
        </div>
      </div>
  );
}