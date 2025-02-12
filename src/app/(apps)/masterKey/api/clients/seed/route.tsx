import {fetchAlt, fetchTransactionAPI} from '@lib/methods/api-fetcher'
import {transactionQuery} from '@lib/server-actions/common-server-actions/doTransaction/doTransaction'
import {Prisma} from '@prisma/client'
import {NextRequest, NextResponse} from 'next/server'

export const POST = async (res: NextRequest) => {
  const doPostUrl = `https://script.google.com/macros/s/AKfycbx9A6JBAxXlPKM1gHCxip8B6dujsfvo3wii4976zHUDCTihqqp3aR24Wk0_NqR5f2Ov9g/exec`

  const response = await fetchAlt(doPostUrl, {action: `getData`})
  const {clients, applicants} = response.result
  const {result: updatedClients} = await updateClients({clients})
  const {result: updatedJobs} = await updateJobs({originalClients: clients, updatedClients})
  const {result: updatedApplicants} = await updateApplicants({
    applicants,
    updatedClients,
    updatedJobs,
  })

  return NextResponse.json({
    updatedClients: updatedClients.length,
    updatedJobs: updatedJobs.length,
    updatedApplicants: updatedApplicants.length,
  })
}

const updateApplicants = async ({applicants, updatedClients, updatedJobs}) => {
  const queries: transactionQuery[] = []

  applicants.forEach(row => {
    const {
      projectName,
      projectNumber,
      jobTitle,
      workLocation,
      personInCharge,
      progressStatus,
      progressDetails,
      startDate,
      name,
      kana,
      tel,
      email,
      address,
      gender,
      birthDate,
      age,
      remarks,
    } = row
    const clientId = updatedClients.find(client => client.email === row.clientEmail)?.id
    const MasterKeyJobId = updatedJobs.find(
      job => job.projectName === projectName && job.jobTitle === jobTitle && job.workLocation === workLocation
    )?.id
    if (!clientId) {
      console.log(`clientId not found: ${email}`)
      return
    }
    if (!MasterKeyJobId) {
      console.log(`clientId not found:`, {jobTitle, workLocation})
      return
    }

    // const clientId = updatedClients.find(client => client.email === row.email).id

    const payload: Prisma.MasterKeyApplicantUpdateArgs = {
      where: {
        unique_projectName_jobTitle_workLocation_masterKeyClientId: {
          projectName,
          jobTitle,
          workLocation,
          masterKeyClientId: clientId,
        },
      },
      data: {
        projectName,
        projectNumber: String(projectNumber),
        jobTitle,
        workLocation,
        personInCharge,
        progressStatus,
        progressDetails,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        name,
        kana,
        tel: String(tel),
        email,
        address,
        gender,
        birthDate: birthDate ? new Date(birthDate).toISOString() : undefined,
        age: Number(age),
        remarks,
        MasterKeyClient: {connect: {id: clientId}},
        MasterKeyJob: {connect: {id: MasterKeyJobId}},
      },
    }

    const clientUpsertQuery: Prisma.MasterKeyApplicantUpsertArgs = {
      where: payload.where,
      update: payload.data,
      create: payload.data as Prisma.MasterKeyApplicantUncheckedCreateInput,
    }

    queries.push({
      model: `masterKeyApplicant`,
      method: `upsert`,
      queryObject: clientUpsertQuery,
    })
  })

  const result = await fetchTransactionAPI({transactionQueryList: queries})
  return result
}
const updateJobs = async ({originalClients, updatedClients}) => {
  const queries: transactionQuery[] = []

  originalClients.forEach(row => {
    const clientId = updatedClients.find(client => client.email === row.email).id
    const {clientGroupName, name, email, Jobs} = row
    Jobs.forEach(job => {
      const {jobTitle, projectName, workLocation} = job

      const payload = {
        projectName,
        jobTitle,
        workLocation,
        MasterKeyClient: {
          connect: {id: clientId},
        },
      }
      const clientUpsertQuery: Prisma.MasterKeyJobUpsertArgs = {
        where: {
          unique_projectName_jobTitle_workLocation_masterKeyClientId: {
            projectName,
            jobTitle,
            workLocation,
            masterKeyClientId: clientId,
          },
        },
        create: payload,
        update: payload,
      }
      queries.push({
        model: `masterKeyJob`,
        method: `upsert`,
        queryObject: clientUpsertQuery,
      })
    })
  })

  const result = await fetchTransactionAPI({transactionQueryList: queries})
  return result
}
const updateClients = async ({clients}) => {
  const queries: transactionQuery[] = []
  clients.forEach(row => {
    const {clientGroupName, name, email, jobCount} = row

    const payload = {
      name,
      email,
      MasterKeyClientGroup: {
        connectOrCreate: {
          where: {name: clientGroupName},
          create: {name: clientGroupName},
        },
      },
    }
    const clientUpsertQuery: Prisma.MasterKeyClientUpsertArgs = {
      where: {email},
      create: payload,
      update: payload,
    }
    queries.push({
      model: `masterKeyClient`,
      method: `upsert`,
      queryObject: clientUpsertQuery,
    })
  })

  const result = await fetchTransactionAPI({transactionQueryList: queries})
  return result
}
