# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  # config as necessary
  config.vm.synced_folder "./server", "/home/vagrant/telegram-server"
  config.vm.synced_folder "./client", "/home/vagrant/telegram-client"

  config.vm.define "master" do |master|
    master.vm.box = "ubuntu/trusty64"
    master.vm.network "forwarded_port", guest: 3000, host: 3000
    master.vm.network "forwarded_port", guest: 80, host: 8081
    master.vm.network "forwarded_port", guest: 4200, host: 4200
    master.vm.network "private_network", ip: "192.168.75.100"
    master.vm.hostname = "telegram"
    master.vm.post_up_message = "Welcome to telegram"
  end

  config.vm.provider "virtualbox" do |v|
    # Customize the amount of memory on the VM:
    v.memory = "1024"
    v.cpus = "1"
  end

  config.vm.provision :shell, path: "bootstrap.sh"
end