package org.zerock.communityBoard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@ComponentScan(basePackages = "org.zerock") //없어도 BoardMapper가 빈으로 잘 등록되는지나중에확인
public class CommunityBoardApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommunityBoardApplication.class, args);
		System.out.println("ㅡㅡㅡㅡ 서버 시작 ㅡㅡㅡㅡ");
	}

}
