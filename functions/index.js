const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const { initializeApp } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const nodemailer = require('nodemailer');

const MANAGER_EMAIL = defineSecret('MANAGER_EMAIL');
const MANAGER_PASSWD = defineSecret('MANAGER_PASSWD');

initializeApp();

exports.SendEmail = onDocumentCreated(
  {
    document: 'emails/{docId}',
    secrets: [MANAGER_EMAIL, MANAGER_PASSWD],
    region: 'asia-northeast3',
  },
  async (event) => {
    const data = event.data?.data();

    if (!data || !data.email) {
      console.error("Firestore email 필드가 없습니다.");
      return;
    }

    const email = MANAGER_EMAIL.value();
    const passwd = MANAGER_PASSWD.value();

    if (!email || !passwd) {
      console.error("관리자 환경변수가 설정되지 않았습니다.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: passwd,
      },
    });

    const bucket = getStorage().bucket();
    let latestFile = null;

    try {
      const [files] = await bucket.getFiles({ prefix: 'images/' });

      if (files.length === 0) {
        console.log("이미지 파일이 없습니다.");
      } else {
        latestFile = files.reduce((latest, file) => {
          const fileTime = new Date(file.metadata.timeCreated).getTime();
          return (!latest || fileTime > new Date(latest.metadata.timeCreated).getTime()) ? file : latest;
        }, null);
      }
    } catch (error) {
      console.error("이미지 파일 가져오는 중 오류 : ", error);
    }

    const attachments = [];
    if (latestFile) {
      try {
        const [buffer] = await latestFile.download();
        attachments.push({
          filename: latestFile.name.split('/').pop(),
          content: buffer,
        });
        console.log("첨부 파일 완료 : ", latestFile.name);
      } catch (err) {
        console.error("첨부 파일 실패 : ", err);
      }
    }

    const mailOptions = {
      from: email,
      to: data.email,
      subject: "[Momenpick!] 소중한 순간을 담은 사진을 보내드립니다!",
      text: [
        "안녕하세요!",
        "미림마이스터고등학교 전공동아리 JS Study 부스 Momenpick!을 방문해주셔서 진심으로 감사합니다 😊",
        "",
        "여러분과 함께한 즐거운 순간을 사진으로 담아 이렇게 보내드립니다.",
        "사진은 소중한 추억으로 오래 간직해주시고, 마음껏 활용해주세요!",
        "",
        "감사합니다!",
        "JS Study 드림",
      ].join("\n"),
      attachments,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("이메일 전송 성공 : ", data.email);
    } catch (err) {
      console.error("이메일 전송 실패 : ", err);
    }
  }
);